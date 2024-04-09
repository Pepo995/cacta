import z from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const monitorRouter = createTRPCRouter({
  summaryByProduct: protectedProcedure
    .input(
      z.object({
        category: z.enum([
          "ClimateChange",
          "EcosystemQuality",
          "HumanHealth",
          "ResourcesExhaustion",
        ]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const kpiBenchmarks = await ctx.prisma.kpi.findMany({
        where: { category: input.category },
        include: {
          organizationCampaignKpiBenchmarks: {
            where: { organizationCampaignId: ctx.session.organizationCampaign.id },
            include: { productKpiBenchmarks: true },
          },
        },
      });

      const productKpis = await ctx.prisma.productKpi.findMany({
        where: {
          productCampaign: {
            establishmentCampaign: {
              organizationCampaignId: ctx.session.organizationCampaign.id,
            },
          },
          kpi: { category: input.category },
        },
        include: {
          scopes: true,
          waterComposition: true,
          productCampaign: { include: { product: true } },
        },
      });

      return { kpiBenchmarks, productKpis };
    }),

  summaryByEstablishment: protectedProcedure
    .input(
      z.object({
        category: z.enum([
          "ClimateChange",
          "EcosystemQuality",
          "HumanHealth",
          "ResourcesExhaustion",
        ]),
      }),
    )
    .query(async ({ ctx, input: { category } }) => {
      const establishmentCampaigns = await ctx.prisma.establishmentCampaign.findMany({
        where: {
          organizationCampaignId: ctx.session.organizationCampaign.id,
        },
        include: {
          establishment: true,
          productCampaigns: {
            include: {
              product: true,
              productKpis: {
                include: {
                  kpi: true,
                  scopes: true,
                  waterComposition: true,
                },
                where: { kpi: { category } },
                orderBy: { kpi: { createdAt: "asc" } },
              },
            },
          },
        },
      });

      return establishmentCampaigns;
    }),
});
