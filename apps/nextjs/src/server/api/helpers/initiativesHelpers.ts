import { type KpiKey, type Prisma, type PrismaClient } from "@cacta/db";

import { intensityKPI } from "~/utils/helperFunctions";
import { round } from "~/utils/mathHelpers";

type ProductCampaignKPIs = Prisma.ProductCampaignGetPayload<{
  include: {
    establishmentCampaign: {
      select: {
        organizationCampaign: { include: { organizationCampaignKpiBenchmarks: true } };
      };
    };
    productKpis: true;
  };
}>;

type OrganizationKpiBenchmarkWithProduct = Prisma.OrganizationCampaignKpiBenchmarkGetPayload<{
  include: { productKpiBenchmarks: true };
}>;

type Context = {
  prisma: PrismaClient;
};

export const productCampaignInclude = {
  establishmentCampaign: {
    select: {
      organizationCampaign: { include: { organizationCampaignKpiBenchmarks: true } },
    },
  },
  productKpis: true,
};

export const findBenchmark = (
  organizationCampaignKpiBenchmarks: (OrganizationKpiBenchmarkWithProduct | null)[],
  kpiId: string,
  productId: string,
) => {
  const organizationCampaignKpiBenchmark = organizationCampaignKpiBenchmarks.find(
    (orgKPI) => orgKPI?.kpiId === kpiId,
  );

  if (organizationCampaignKpiBenchmark) {
    const productKpiBenchmark = organizationCampaignKpiBenchmark.productKpiBenchmarks.find(
      (pKpi) => pKpi.productId === productId,
    );

    return productKpiBenchmark?.benchmark ?? organizationCampaignKpiBenchmark.benchmark;
  }

  return null;
};

export const findKpiPerformance = (
  productCampaigns: ProductCampaignKPIs[] | null,
  kpiId: string,
  kpiKey: KpiKey,
) => {
  let totalHarvestedAmount = 0;
  let totalKpiValue = 0;

  if (productCampaigns) {
    for (const productCampaign of productCampaigns) {
      if (!productCampaign.endDate) return null;

      const kpiValues = productCampaign.productKpis
        .filter((kpi) => kpi.kpiId === kpiId)
        .reduce((kpiAcc, kpi) => kpiAcc + kpi.totalValue, 0);

      totalKpiValue += kpiValues;
      totalHarvestedAmount += productCampaign.harvestedAmount ?? 0;
    }
  }

  if (intensityKPI(kpiKey)) return totalKpiValue;

  return totalHarvestedAmount ? totalKpiValue / totalHarvestedAmount : 0;
};

export const calculatePerformanceComparison = (
  currentPerformance: number | null,
  reference: "LastCampaign" | "Benchmark" | "Custom",
  valueToCompare: number | null,
) => {
  if (!currentPerformance) return null;

  if (reference !== "Custom") {
    return valueToCompare
      ? round(((currentPerformance - valueToCompare) / valueToCompare) * 100)
      : 0;
  }

  return round(currentPerformance);
};

export const findPreviousProductCampaigns = async (
  startDate: Date,
  productId: string,
  ctx: Context,
  organizationId: string,
) => {
  const previousOrganizationCampaign = await ctx.prisma.organizationCampaign.findFirst({
    where: {
      organizationId,
      startDate: { lt: startDate },
    },
    orderBy: { startDate: "desc" },
  });

  return await ctx.prisma.productCampaign.findMany({
    where: {
      establishmentCampaign: {
        organizationCampaignId: previousOrganizationCampaign?.id,
      },
      productId,
    },
    include: productCampaignInclude,
  });
};
