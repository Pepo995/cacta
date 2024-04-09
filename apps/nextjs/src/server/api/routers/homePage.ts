import {
  type KpiKey,
  type OrganizationCampaignKpiBenchmark,
  type Product,
  type ProductCampaign,
  type ProductKpi,
} from "@cacta/db";
import { TRPCError } from "@trpc/server";

import { intensityKPI } from "~/utils/helperFunctions";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type ProductCampaignWithProduct = ProductCampaign & { product: Product };

type ProductKpiWithCampaigns = ProductKpi & {
  productCampaign: ProductCampaignWithProduct;
};

const getBenchmark = (kpiId: string, kpiBenchmarks: OrganizationCampaignKpiBenchmark[]) =>
  kpiBenchmarks.find((kpiBenchmark) => kpiBenchmark.kpiId === kpiId)?.benchmark ?? 0;

const getTotalKpi = (kpiId: string, productKpis: ProductKpiWithCampaigns[], kpiKey: KpiKey) => {
  const totalKpi = productKpis.reduce(
    (accumulator, productKpi) =>
      productKpi.kpiId === kpiId && productKpi.productCampaign.harvestedAmount
        ? accumulator + productKpi.totalValue
        : accumulator,
    0,
  );

  const harvestedAmountKpi = productKpis.reduce(
    (accumulator, productKpi) =>
      productKpi.kpiId === kpiId && productKpi.productCampaign.harvestedAmount
        ? accumulator + productKpi.productCampaign.harvestedAmount
        : accumulator,
    0,
  );

  return intensityKPI(kpiKey) ? totalKpi : totalKpi / harvestedAmountKpi;
};

const getProductsAndValues = (
  kpiId: string,
  productKpis: ProductKpiWithCampaigns[],
  kpiKey: KpiKey,
) => {
  const filteredProductKpis = productKpis.filter((productKpi) => productKpi.kpiId === kpiId);

  const products: Product[] = [];
  const uniqueProductIds = new Set();

  filteredProductKpis.forEach((productKpi) => {
    const product = productKpi.productCampaign.product;
    const productId = product.id;

    if (!uniqueProductIds.has(productId)) {
      uniqueProductIds.add(productId);
      products.push(product);
    }
  });

  const productsAndValues = products.map((product) => {
    const productArray = filteredProductKpis.filter(
      (productKpi) => productKpi.productCampaign.productId === product.id,
    );

    return {
      name: product.name,
      value: getTotalKpi(kpiId, productArray, kpiKey),
    };
  });

  return productsAndValues;
};

export const homePageRouter = createTRPCRouter({
  homePageData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { homePageKpis: { orderBy: { createdAt: "asc" } } },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    const userKpis = user.homePageKpis.map((kpi) => kpi.id);
    const logoUrl = ctx.session.organizationCampaign.organization.imageUrl;

    const kpiBenchmarks = await ctx.prisma.organizationCampaignKpiBenchmark.findMany({
      where: {
        organizationCampaignId: ctx.session.organizationCampaign.id,
        kpiId: { in: userKpis },
      },
    });

    const homePageKpiIds = kpiBenchmarks.map((item) => item.kpiId);
    const homePageKpis = user.homePageKpis.filter((item) => homePageKpiIds.includes(item.id));

    const productKpis = await ctx.prisma.productKpi.findMany({
      where: {
        productCampaign: {
          establishmentCampaign: {
            organizationCampaignId: ctx.session.organizationCampaign.id,
          },
        },
        kpiId: { in: homePageKpiIds },
      },
      include: {
        productCampaign: { include: { product: true } },
      },
    });

    const homePageData = homePageKpis.map((kpi) => ({
      id: kpi.id,
      benchmark: getBenchmark(kpi.id, kpiBenchmarks),
      totalValue: getTotalKpi(kpi.id, productKpis, kpi.key),
      name: kpi.name,
      category: kpi.category,
      description: kpi.description,
      products: getProductsAndValues(kpi.id, productKpis, kpi.key),
    }));

    return { homePageData, logoUrl };
  }),
});
