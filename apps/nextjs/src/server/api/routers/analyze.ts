import { type Activity } from "@cacta/db";
import z from "zod";

import { type EnergyClassification, type WaterFooprints } from "~/utils/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const categoryType = z.enum([
  "ClimateChange",
  "EcosystemQuality",
  "HumanHealth",
  "ResourcesExhaustion",
]);

export const analyzeRouter = createTRPCRouter({
  productsAndKpisList: protectedProcedure
    .input(
      z.object({
        category: categoryType,
      }),
    )
    .query(async ({ ctx, input }) => {
      const productsList = await ctx.prisma.product.findMany({
        where: {
          productCampaigns: {
            every: {
              endDate: { not: null },
              harvestedAmount: { not: null },
            },
            some: {
              productKpis: {
                some: { kpi: { category: input.category } },
              },
              establishmentCampaign: {
                organizationCampaignId: ctx.session.organizationCampaign.id,
              },
            },
          },
        },
      });

      const kpisList = await ctx.prisma.kpi.findMany({
        where: {
          category: input.category,
          productKpis: {
            some: {
              productCampaign: {
                establishmentCampaign: {
                  organizationCampaignId: ctx.session.organizationCampaign.id,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return {
        productsList,
        kpisList,
      };
    }),

  performancePanel: protectedProcedure
    .input(
      z.object({
        productIdFilter: z.string().optional(),
        kpiIdFilter: z.string().optional(),
        category: categoryType,
      }),
    )
    .query(async ({ ctx, input }) => {
      const benchmark = (
        await ctx.prisma.organizationCampaignKpiBenchmark.findFirst({
          where: {
            organizationCampaignId: ctx.session.organizationCampaign.id,
            kpiId: input.kpiIdFilter,
          },
          include: { productKpiBenchmarks: true },
        })
      )?.productKpiBenchmarks.find(
        (productKpiBenchmark) => productKpiBenchmark.productId === input.productIdFilter,
      )?.benchmark;

      const activityProductKpis = await ctx.prisma.activityProductKpi.findMany({
        where: {
          productKpi: {
            kpi: { category: input.category },
            kpiId: input.kpiIdFilter,
            productCampaign: {
              productId: input.productIdFilter,
              establishmentCampaign: {
                organizationCampaignId: ctx.session.organizationCampaign.id,
              },
            },
          },
        },
        include: {
          productKpi: {
            include: { productCampaign: true },
          },
        },
        orderBy: { activity: "asc" },
      });

      const activityProductKpiIds = activityProductKpis.map(
        (activityProductKpi) => activityProductKpi.id,
      );

      const activitiesList: Activity[] = [];

      activityProductKpis.forEach((activityProductKpi) => {
        !activitiesList.some((uniqueActivity) => uniqueActivity === activityProductKpi.activity) &&
          activitiesList.push(activityProductKpi.activity);
      });

      const activityInputs = await ctx.prisma.activityInput.findMany({
        where: { activityId: { in: activityProductKpiIds } },
        include: { activity: true, input: true },
      });

      const selectedProductAmount = (
        await ctx.prisma.productCampaign.findMany({
          where: {
            productId: input.productIdFilter,
            establishmentCampaign: {
              organizationCampaignId: ctx.session.organizationCampaign.id,
            },
          },
        })
      ).reduce(
        (accumulator, productCampaig) => accumulator + (productCampaig.harvestedAmount ?? 0),
        0,
      );

      const totalKpi = (
        await ctx.prisma.productKpi.findMany({
          where: {
            productCampaign: {
              establishmentCampaign: {
                organizationCampaignId: ctx.session.organizationCampaign.id,
              },
              productId: input.productIdFilter,
            },
            kpiId: input.kpiIdFilter,
          },
        })
      ).reduce((accumulator, productKpi) => productKpi.totalValue + accumulator, 0);

      return {
        activitiesList,
        activityProductKpis,
        activityInputs,
        benchmark,
        selectedProductAmount,
        organizationCampaign: ctx.session.organizationCampaign,
        totalKpi,
      };
    }),

  electricity: protectedProcedure
    .input(
      z.object({
        productIdFilter: z.string().optional(),
        kpiIdFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const productKpis = await ctx.prisma.productKpi.findMany({
        where: {
          productCampaign: {
            productId: input.productIdFilter,
            establishmentCampaign: {
              organizationCampaignId: ctx.session.organizationCampaign.id,
            },
          },
          kpiId: input.kpiIdFilter,
        },
      });

      const productKpiIds = productKpis.map((productKpi) => productKpi.id);

      const productKpiElectricitySources = await ctx.prisma.productKpiElectricitySource.findMany({
        where: { productKpiId: { in: productKpiIds } },
      });

      const electricitySourcesList = await ctx.prisma.electricitySource.findMany({});

      const electricitySources = electricitySourcesList.map((source) => {
        const value = productKpiElectricitySources.reduce(
          (accumulator, item) =>
            item.electricitySourceId === source.id ? accumulator + item.value : accumulator,
          0,
        );

        return {
          ...source,
          value,
        };
      });

      const renewable = electricitySources.reduce(
        (accumulator, sources) => (sources.renewable ? accumulator + sources.value : accumulator),
        0,
      );

      const nonRenewable = electricitySources.reduce(
        (accumulator, sources) => (!sources.renewable ? accumulator + sources.value : accumulator),
        0,
      );

      const total = renewable + nonRenewable;

      const classification = [
        {
          key: "renewable" as EnergyClassification,
          value: (renewable / total) * 100,
        },
        {
          key: "nonRenewable" as EnergyClassification,
          value: (nonRenewable / total) * 100,
        },
      ];

      return { electricitySources, classification };
    }),

  waterComposition: protectedProcedure
    .input(
      z.object({
        productIdFilter: z.string().optional(),
        kpiIdFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const productKpis = await ctx.prisma.productKpi.findMany({
        where: {
          productCampaign: {
            productId: input.productIdFilter,
            establishmentCampaign: {
              organizationCampaignId: ctx.session.organizationCampaign.id,
            },
          },
          kpiId: input.kpiIdFilter,
        },
        include: { waterComposition: true, productCampaign: true },
      });

      const waterCompositions = productKpis.map((productKpi) => ({
        ...productKpi.waterComposition,
        harvestedAmount: productKpi.productCampaign.harvestedAmount ?? 0,
      }));

      const totalHarvestedAmount = waterCompositions.reduce(
        (accumulator, item) => accumulator + item.harvestedAmount,
        0,
      );

      const waterComposition = {
        greenFootprint: 0,
        blueFootprint: 0,
        requiredWater: 0,
        rainfall: 0,
        irrigation: 0,
        lostRainfall: 0,
        lostIrrigation: 0,
        balance: 0,
      };

      type Keys = keyof typeof waterComposition;
      type ChartKeys = Exclude<Keys, "greenFootprint" | "blueFootprint">;

      const keys = Object.keys(waterComposition) as Keys[];

      keys.forEach((key) => {
        waterComposition[key] = waterCompositions.reduce(
          (accumulator, item) =>
            accumulator + ((item?.[key] ?? 0) * item.harvestedAmount) / totalHarvestedAmount,
          0,
        );
      });

      const chartKeys = keys.filter(
        (key) => key !== "blueFootprint" && key !== "greenFootprint",
      ) as ChartKeys[];

      const barChartData = chartKeys.map((key) => ({
        key: key,
        value: waterComposition[key],
      }));

      const totalFootprints = waterComposition.blueFootprint + waterComposition.greenFootprint;

      const footprints = [
        {
          key: "blueFootprint" as WaterFooprints,
          value: (waterComposition.blueFootprint / totalFootprints) * 100,
        },
        {
          key: "greenFootprint" as WaterFooprints,
          value: (waterComposition.greenFootprint / totalFootprints) * 100,
        },
      ];

      const waterProductivityKpi = await ctx.prisma.kpi.findFirst({
        where: { key: "WaterProductivity" },
      });

      const waterProductivityBenchmark = (
        await ctx.prisma.organizationCampaignKpiBenchmark.findFirst({
          where: {
            organizationCampaignId: ctx.session.organizationCampaign.id,
            kpi: { key: "WaterProductivity" },
          },
        })
      )?.benchmark;

      const waterProductivityProductKpis = await ctx.prisma.productKpi.findMany({
        where: {
          productCampaign: {
            productId: input.productIdFilter,
            establishmentCampaign: {
              organizationCampaignId: ctx.session.organizationCampaign.id,
            },
          },
          kpi: { key: "WaterProductivity" },
        },
        include: { waterComposition: true },
      });

      const waterProductivityKpiValue = waterProductivityProductKpis.reduce(
        (accumulator, productKpi) => accumulator + productKpi.totalValue,
        0,
      );

      const waterProductivity = {
        name: waterProductivityKpi?.name,
        value: waterProductivityKpiValue,
        unit: waterProductivityKpi?.unit,
        benchmark: waterProductivityBenchmark,
      };

      return { barChartData, footprints, waterProductivity };
    }),

  performanceStages: protectedProcedure
    .input(
      z.object({
        productIdFilter: z.string().optional(),
        category: categoryType,
      }),
    )
    .query(async ({ ctx, input }) => {
      const activityProductKpis = await ctx.prisma.activityProductKpi.findMany({
        where: {
          productKpi: {
            kpi: { category: input.category },
            productCampaign: {
              productId: input.productIdFilter,
              establishmentCampaign: {
                organizationCampaignId: ctx.session.organizationCampaign.id,
              },
            },
          },
        },
        include: {
          productKpi: {
            include: { productCampaign: true },
          },
          activityInputs: true,
        },
        orderBy: { activity: "asc" },
      });

      const kpis = await ctx.prisma.kpi.findMany({
        where: { category: input.category },
      });

      const activityProductKpisByKpi = kpis.map((kpi) => ({
        kpiId: kpi.id,
        activityProductKpis: activityProductKpis.filter(
          (activityProductKpi) => activityProductKpi.productKpi.kpiId === kpi.id,
        ),
      }));

      const activitiesList: Activity[] = [];

      activityProductKpis.forEach((activityProductKpi) => {
        !activitiesList.some((uniqueActivity) => uniqueActivity === activityProductKpi.activity) &&
          activitiesList.push(activityProductKpi.activity);
      });

      return {
        activitiesList,
        activityProductKpisByKpi,
      };
    }),
});
