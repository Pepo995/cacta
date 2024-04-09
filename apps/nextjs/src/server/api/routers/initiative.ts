import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { INVALID_BENCHMARK, INVALID_LAST_CAMPAIGN } from "~/utils/constants/errors";
import { round } from "~/utils/mathHelpers";
import {
  calculatePerformanceComparison,
  findBenchmark,
  findKpiPerformance,
  findPreviousProductCampaigns,
  productCampaignInclude,
} from "../helpers/initiativesHelpers";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const initiativeRouter = createTRPCRouter({
  createInitiative: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        productId: z.string(),
        description: z.string().nullable(),
        kpiId: z.string(),
        objective: z.number(),
        startDate: z.date(),
        endDate: z.date(),
        reference: z.enum(["LastCampaign", "Benchmark", "Custom"]),
        responsibleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const organizationCampaigns = await ctx.prisma.organizationCampaign.findMany({
        where: {
          organization: { id: { equals: ctx.session.organizationId } },
          establishmentCampaigns: {
            some: {
              productCampaigns: { some: { productId: input.productId } },
            },
          },
        },
        orderBy: { startDate: "desc" },
        take: 2,
      });

      if (!organizationCampaigns[0])
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No valid organization campaign was found for the given product in this organization.",
        });

      if (input.reference === "LastCampaign" && organizationCampaigns.length < 2)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: INVALID_LAST_CAMPAIGN,
        });

      const organizationCampaignId = organizationCampaigns[0].id;

      if (input.reference === "Benchmark") {
        const organizationCampaignKpiBenchmark =
          await ctx.prisma.organizationCampaignKpiBenchmark.findFirst({
            where: { organizationCampaignId, kpiId: input.kpiId },
          });

        if (!organizationCampaignKpiBenchmark)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: INVALID_BENCHMARK,
          });
      }

      const initiative = await ctx.prisma.initiative.create({
        data: {
          ...input,
          organizationCampaignId,
        },
        select: {
          id: true,
        },
      });

      return initiative;
    }),

  getInitiatives: protectedProcedure
    .input(
      z.object({
        type: z.enum(["actual", "past"]),
        pageSize: z.number().optional(),
        pageIndex: z.number().optional(),
        sorting: z
          .object({
            sortBy: z.string(),
            sortOrder: z.enum(["asc", "desc"]),
          })
          .optional(),
        searchQuery: z.string().nullish(),
        locale: z.string(),
        dateRange: z
          .object({
            from: z.date().optional(),
            to: z.date().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { pageIndex, pageSize, type } = input;

      let searchFilter = {};

      if (input.searchQuery) {
        const idsMatchingKpi: { id: string }[] = await ctx.prisma.$queryRaw`
          SELECT "Initiative"."id" FROM "Initiative"
          INNER JOIN "Kpi" ON "Initiative"."kpiId" = "Kpi"."id"
          WHERE unaccent("Kpi"."name"->>${input.locale}) ILIKE unaccent(${`%${input.searchQuery}%`})
        `;

        const idsMatchingProduct: { id: string }[] = await ctx.prisma.$queryRaw`
          SELECT "Initiative"."id" FROM "Initiative"
          INNER JOIN "Product" ON "Initiative"."productId" = "Product"."id"
          WHERE unaccent("Product"."name"->>${
            input.locale
          }) ILIKE unaccent(${`%${input.searchQuery}%`})
        `;

        searchFilter = {
          OR: [
            { name: { contains: input.searchQuery ?? undefined, mode: "insensitive" } },
            {
              user: {
                firstName: { contains: input.searchQuery ?? undefined, mode: "insensitive" },
              },
            },
            {
              OR: [
                { id: { in: idsMatchingKpi.map(({ id }) => id) } },
                { id: { in: idsMatchingProduct.map(({ id }) => id) } },
              ],
            },
          ],
        };
      }

      const dateFilter = input.dateRange
        ? input.dateRange.to
          ? {
              OR: [
                { startDate: { gte: input.dateRange?.from, lte: input.dateRange?.to } },
                { endDate: { gte: input.dateRange.from, lte: input.dateRange?.to } },
              ],
            }
          : {
              OR: [{ startDate: input.dateRange?.from }, { endDate: input.dateRange?.from }],
            }
        : {};

      const initiativesWhere = {
        ...searchFilter,
        ...dateFilter,
        organizationCampaign: type === "actual" ? { endDate: null } : { endDate: { not: null } },
        user: {
          organizations: {
            some: {
              id: ctx.session.organizationId,
            },
          },
        },
      };

      const { sortBy, sortOrder } = input.sorting ?? { sortBy: "startDate", sortOrder: "desc" };

      let orderBy;
      if (sortBy === "product") {
        orderBy = {
          product: {
            name: sortOrder,
          },
        };
      } else if (sortBy === "responsible") {
        orderBy = {
          user: {
            firstName: sortOrder,
          },
        };
      } else {
        orderBy = {
          [sortBy]: sortOrder,
        };
      }

      const initiatives = await ctx.prisma.initiative.findMany({
        where: initiativesWhere,
        orderBy,
        skip: typeof pageIndex === "number" && pageSize ? pageIndex * pageSize : undefined,
        take: pageSize,
        include: {
          kpi: true,
          user: true,
          product: true,
          organizationCampaign: {
            include: {
              organizationCampaignKpiBenchmarks: { include: { productKpiBenchmarks: true } },
            },
          },
        },
      });

      const initiativesTotal = await ctx.prisma.initiative.count({
        where: initiativesWhere,
      });

      const initiativesWithProductCampaigns = await Promise.all(
        initiatives.map(async (initiative) => {
          const productCampaigns = await ctx.prisma.productCampaign.findMany({
            where: {
              establishmentCampaign: {
                organizationCampaignId: initiative.organizationCampaignId,
              },
              productId: initiative.productId,
            },
            include: productCampaignInclude,
          });

          return {
            ...initiative,
            productCampaigns,
          };
        }),
      );

      const initiativesToReturn = await Promise.all(
        initiativesWithProductCampaigns.map(
          async ({
            name,
            kpi,
            endDate,
            description,
            kpiId,
            objective,
            responsibleId,
            productId,
            product,
            startDate,
            user,
            id,
            reference,
            organizationCampaign,
            productCampaigns,
          }) => {
            let valueToCompare: number | null = null;
            if (reference === "LastCampaign") {
              const lastProductCampaigns = await findPreviousProductCampaigns(
                startDate,
                productId,
                ctx,
                ctx.session.organizationId,
              );
              valueToCompare =
                findKpiPerformance(lastProductCampaigns ?? null, kpiId, kpi.key) ?? 1;
            } else if (reference === "Benchmark") {
              valueToCompare =
                findBenchmark(
                  organizationCampaign.organizationCampaignKpiBenchmarks,
                  kpiId,
                  productId,
                ) ?? 1;
            }

            const kpiPerformance = findKpiPerformance(productCampaigns, kpiId, kpi.key);

            return {
              id,
              kpiId,
              description,
              name,
              category: kpi.category,
              kpi,
              unit: kpi.unit,
              productId,
              product: product.name,
              objective: objective,
              objectiveToShow: round(objective),
              startDate,
              endDate,
              performanceToShow: calculatePerformanceComparison(
                kpiPerformance,
                reference,
                valueToCompare,
              ),
              responsible: user.firstName,
              responsibleId,
              reference,
            };
          },
        ),
      );

      return {
        initiatives: initiativesToReturn,
        total: initiativesTotal,
      };
    }),

  getInitiativesModalData: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        productCampaigns: {
          some: {
            establishmentCampaign: { organizationCampaignId: ctx.session.organizationCampaign.id },
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const kpis = await ctx.prisma.kpi.findMany({
      select: { id: true, name: true, unit: true },
      orderBy: { createdAt: "asc" },
    });

    const orgUsers = await ctx.prisma.user.findMany({
      where: {
        organizations: {
          some: {
            id: ctx.session.organizationId,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return {
      products,
      kpis,
      orgUsers,
    };
  }),

  deleteInitiative: protectedProcedure
    .input(
      z.object({
        initiativeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedInitiative = await ctx.prisma.initiative.delete({
        where: {
          id: input.initiativeId,
        },
      });

      if (!deletedInitiative) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Initiative not found or couldn't be deleted.",
        });
      }
    }),

  updateInitiative: protectedProcedure
    .input(
      z.object({
        initiativeId: z.string(),
        name: z.string().optional(),
        productId: z.string().optional(),
        description: z.string().optional().nullable(),
        kpiId: z.string().optional(),
        objective: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        reference: z.enum(["LastCampaign", "Benchmark", "Custom"]),
        responsibleId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { initiativeId, ...updateData } = input;

      const organizationCampaigns = await ctx.prisma.organizationCampaign.findMany({
        where: {
          organization: { id: { equals: ctx.session.organizationId } },
          establishmentCampaigns: {
            some: {
              productCampaigns: { some: { productId: input.productId } },
            },
          },
        },
        orderBy: { startDate: "desc" },
        take: 2,
      });

      if (!organizationCampaigns[0])
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No valid organization campaign was found for the given product in this organization.",
        });

      if (input.reference === "LastCampaign" && organizationCampaigns.length < 2)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: INVALID_LAST_CAMPAIGN,
        });

      const organizationCampaignId = organizationCampaigns[0].id;

      if (input.reference === "Benchmark") {
        const organizationCampaignKpiBenchmark =
          await ctx.prisma.organizationCampaignKpiBenchmark.findFirst({
            where: { organizationCampaignId, kpiId: input.kpiId },
          });

        if (!organizationCampaignKpiBenchmark)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: INVALID_BENCHMARK,
          });
      }

      return await ctx.prisma.initiative.update({
        where: { id: initiativeId },
        data: { ...updateData, organizationCampaignId },
      });
    }),
});
