import { type ActivityInput, type Kpi, type KpiCategory, type Product } from "@cacta/db";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { round } from "~/utils/mathHelpers";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type OrganizationProductCampaign = {
  product: Pick<Product, "id" | "name" | "cpcId" | "cpcName">;
  startDate: Date;
  endDate: Date | null;
  organizationCampaignId: string;
  projectId: string;
};

type ActivityInputTotals = Pick<
  ActivityInput,
  "totalValue" | "core" | "upstream" | "downstream" | "transportation"
>;

type KpiAccumulator = {
  [kpiId: string]: {
    kpiName: Kpi["name"];
    kpiKey: Kpi["key"];
    category: KpiCategory;
    unit: string;
    totals: ActivityInputTotals;
  };
};

export const reportRouter = createTRPCRouter({
  productsAndCampaignsList: protectedProcedure.query(async ({ ctx }) => {
    const organizationCampaigns = await ctx.prisma.organizationCampaign.findMany({
      where: {
        organizationId: ctx.session.organizationId,
      },
      orderBy: { startDate: "desc" },
    });

    if (!organizationCampaigns) throw new TRPCError({ code: "NOT_FOUND" });

    const productsAndCampaignsList = await Promise.all(
      organizationCampaigns.map(async (organizationCampaign) => {
        const products = await ctx.prisma.product.findMany({
          where: {
            productCampaigns: {
              every: {
                endDate: { not: null },
                harvestedAmount: { not: null },
              },
              some: {
                establishmentCampaign: {
                  organizationCampaignId: organizationCampaign.id,
                },
              },
            },
          },
          select: { id: true, name: true },
        });

        const totalProducts = await ctx.prisma.product.count({
          where: {
            productCampaigns: {
              some: {
                establishmentCampaign: {
                  organizationCampaignId: organizationCampaign.id,
                },
              },
            },
          },
        });

        return {
          id: organizationCampaign.id,
          startDate: organizationCampaign.startDate,
          endDate: organizationCampaign.endDate,
          products,
          totalProducts,
        };
      }),
    );

    return productsAndCampaignsList;
  }),

  ecoScoreData: protectedProcedure
    .input(
      z.object({
        productId: z.string().optional(),
        organizationCampaignId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationCampaigns = await ctx.prisma.organizationCampaign.findMany({
        where: {
          organizationId: ctx.session.organizationId,
        },
        orderBy: { startDate: "desc" },
        select: { id: true },
      });

      const indexOfPreviousCampaign =
        organizationCampaigns.findIndex(
          (organizationCampaign) => organizationCampaign.id === input.organizationCampaignId,
        ) + 1;

      const previousCampaignId = organizationCampaigns[indexOfPreviousCampaign]?.id;

      const valuesSelectedCampaign = await ctx.prisma.kpiScore.findMany({
        where: {
          organizationCampaignScore: {
            organizationCampaignId: input.organizationCampaignId,
            productId: input.productId ?? null,
          },
        },
        include: { kpi: true },
        orderBy: { kpi: { createdAt: "asc" } },
      });

      const valuesPreviousCampaign = previousCampaignId
        ? await ctx.prisma.kpiScore.findMany({
            where: {
              organizationCampaignScore: {
                organizationCampaignId: previousCampaignId,
                productId: input.productId ?? null,
              },
            },
            include: { kpi: true },
          })
        : [];

      const kpiCategories: KpiCategory[] = [
        "ClimateChange",
        "EcosystemQuality",
        "HumanHealth",
        "ResourcesExhaustion",
      ];

      const kpiEcoScores = kpiCategories.map((category) => ({
        categoryKey: category,
        kpiResults: valuesSelectedCampaign
          .filter((kpiScore) => kpiScore.kpi.category === category)
          .map((kpiScore) => ({
            kpiId: kpiScore.kpiId,
            kpiName: kpiScore.kpi.name,
            ecoScoreValue: kpiScore.ecoScoreValue,
            ecoScoreGrade: kpiScore.ecoScoreGrade,
            previousCampaignGrade: valuesPreviousCampaign.find(
              (item) => item.kpiId === kpiScore.kpiId,
            )?.ecoScoreGrade,
          })),
      }));

      const totalEcoScore = await ctx.prisma.organizationCampaignScore.findFirst({
        where: {
          organizationCampaignId: input.organizationCampaignId,
          productId: input.productId ?? null,
        },
      });

      return { kpiEcoScores, totalEcoScore };
    }),

  getProductScore: protectedProcedure
    .input(
      z.object({
        pageSize: z.number().optional(),
        pageIndex: z.number().optional(),
        searchQuery: z.string().nullish(),
        locale: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input: { pageIndex, pageSize, searchQuery, locale } }) => {
      const language = locale || "en";

      const searchIds: { id: string }[] | null = searchQuery
        ? await ctx.prisma.$queryRaw`
        SELECT pc."id" FROM "ProductCampaign" as pc
        JOIN "Product" as p ON pc."productId" = p."id"
        WHERE unaccent(p."name"->>${language}) ilike unaccent(${`%${searchQuery}%`})`
        : null;

      const queryFilter = searchIds ? { id: { in: searchIds.map(({ id }) => id) } } : {};

      const productsIds = (
        await ctx.prisma.product.findMany({
          where: {
            productCampaigns: {
              some: {
                establishmentCampaign: {
                  organizationCampaignId: ctx.session.organizationCampaign.id,
                },
              },
              every: {
                endDate: { not: null },
              },
            },
          },
        })
      ).map((product) => product.id);

      const productCampaignsWhere = {
        ...queryFilter,
        establishmentCampaign: {
          organizationCampaign: { organizationId: ctx.session.organizationId },
        },
        endDate: { not: null },
        productId: { in: productsIds },
      };

      const productCampaignsTotal = await ctx.prisma.productCampaign.count({
        where: productCampaignsWhere,
      });

      const productCampaigns = await ctx.prisma.productCampaign.findMany({
        where: productCampaignsWhere,
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
              cpcId: true,
              cpcName: true,
            },
          },
          startDate: true,
          endDate: true,
          establishmentCampaign: {
            select: {
              organizationCampaign: {
                select: {
                  id: true,
                  startDate: true,
                  endDate: true,
                  projectId: true,
                },
              },
            },
          },
        },
        skip: typeof pageIndex === "number" && pageSize ? pageIndex * pageSize : undefined,
        take: pageSize,
      });

      const organizationProductCampaigns = productCampaigns.reduce(
        (acc: OrganizationProductCampaign[], productCampaign) => {
          const existingGroup = acc.find(
            (group) =>
              group.product.id === productCampaign.product.id &&
              group.organizationCampaignId ===
                productCampaign.establishmentCampaign.organizationCampaign.id,
          );

          if (!existingGroup) {
            acc.push({
              product: productCampaign.product,
              startDate: productCampaign.startDate,
              endDate: productCampaign.endDate,
              organizationCampaignId: productCampaign.establishmentCampaign.organizationCampaign.id,
              projectId: productCampaign.establishmentCampaign.organizationCampaign.projectId,
            });
          } else {
            existingGroup.startDate = new Date(
              Math.min(
                new Date(existingGroup.startDate).getTime(),
                new Date(productCampaign.startDate).getTime(),
              ),
            );

            existingGroup.endDate = new Date(
              Math.max(
                new Date(existingGroup.endDate ?? "").getTime(),
                new Date(productCampaign.endDate ?? "").getTime(),
              ),
            );
          }

          return acc;
        },
        [],
      );

      return {
        productCampaigns: Object.values(organizationProductCampaigns),
        total: productCampaignsTotal,
      };
    }),

  getActivityInputsByProduct: protectedProcedure
    .input(
      z.object({
        organizationCampaignId: z.string(),
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { organizationCampaignId, productId } }) => {
      const productCampaigns = await ctx.prisma.productCampaign.findMany({
        where: {
          establishmentCampaign: { organizationCampaignId },
          productId,
        },
        select: {
          productKpis: {
            select: {
              activityProductKpis: {
                select: {
                  activityInputs: true,
                },
              },
              kpi: true,
            },
            orderBy: { kpi: { createdAt: "asc" } },
          },
          harvestedAmount: true,
        },
      });

      const totalHarvestedAmount = productCampaigns.reduce(
        (acc, { harvestedAmount }) => (acc += harvestedAmount ?? 0),
        0,
      );

      //Accumulate activity inputs values for each productCampaign for the same product
      const kpiActivityInputs = productCampaigns.reduce((acc, productCampaign) => {
        productCampaign.productKpis.forEach((productKpi) => {
          const { id: kpiId, name: kpiName, category, unit, key } = productKpi.kpi;

          if (!acc[kpiId]) {
            acc[kpiId] = {
              kpiName,
              kpiKey: key,
              category,
              unit,
              totals: {
                upstream: 0,
                core: 0,
                transportation: 0,
                downstream: 0,
                totalValue: 0,
              },
            };
          }

          productKpi.activityProductKpis.forEach(({ activityInputs }) => {
            activityInputs.forEach((input) => {
              const kpi = acc[kpiId];
              if (kpi) {
                kpi.totals.upstream += input.upstream;
                kpi.totals.core += input.core;
                kpi.totals.transportation += input.transportation;
                kpi.totals.downstream += input.downstream;
                kpi.totals.totalValue += input.totalValue;
              }
            });
          });
        });

        return acc;
      }, {} as KpiAccumulator);

      type CategoryWithKpis = {
        categoryName: KpiCategory;
        kpis: (typeof kpiActivityInputs)[string][];
      };

      //Regroup kpiActivityInputs by category
      const activityInputsByCategory = Object.values(kpiActivityInputs).reduce(
        (acc: CategoryWithKpis[], item) => {
          const existingCategory = acc.find((cat) => cat.categoryName === item.category);

          if (existingCategory) {
            existingCategory.kpis.push(item);
          } else {
            acc.push({ categoryName: item.category, kpis: [item] });
          }

          return acc;
        },
        [],
      );

      const categoryOrder = [
        "ClimateChange",
        "EcosystemQuality",
        "HumanHealth",
        "ResourcesExhaustion",
      ];

      activityInputsByCategory.sort(
        (a, b) => categoryOrder.indexOf(a.categoryName) - categoryOrder.indexOf(b.categoryName),
      );

      //Make final calculations of the activity inputs to display
      const activityInputsToReturn = activityInputsByCategory.map((category) => ({
        categoryName: category.categoryName,
        kpis: category.kpis.map((kpi) => ({
          ...kpi,
          totals: {
            upstream: round(kpi.totals.upstream / (totalHarvestedAmount * 1000), 3),
            core: round(
              (kpi.totals.core + kpi.totals.transportation) / (totalHarvestedAmount * 1000),
              3,
            ),
            downstream: round(kpi.totals.downstream / (totalHarvestedAmount * 1000), 3),
            totalValue: round(kpi.totals.totalValue / (totalHarvestedAmount * 1000), 3),
          },
        })),
      }));

      return activityInputsToReturn;
    }),
});
