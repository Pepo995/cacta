import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type KpiCategory, type Product, type ProductCampaign } from "@cacta/db";
import { useLocale, useTranslations } from "next-intl";

import { api, type RouterOutputs } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { intensityKPI } from "~/utils/helperFunctions";
import { type ModeType } from "~/utils/types";

type SummaryByProduct = RouterOutputs["monitor"]["summaryByProduct"];
export type KpiBenchmark = SummaryByProduct["kpiBenchmarks"][number];
export type ProductKPI = SummaryByProduct["productKpis"][number];

type UseSummaryByProductProps = {
  mode: ModeType;
  category: KpiCategory;
  selectedProductIds: string[];
  setSelectedProductIds: Dispatch<SetStateAction<string[]>>;
};

const useSummaryByProduct = ({
  mode,
  category,
  selectedProductIds,
  setSelectedProductIds,
}: UseSummaryByProductProps) => {
  const locale = useLocale();
  const t = useTranslations();

  const { data: pageData, isLoading: pageDataLoading } = api.monitor.summaryByProduct.useQuery({
    category,
  });

  const [selectedKpi, setSelectedKpi] = useState<KpiBenchmark>();

  const kpiBenchmarks = pageData?.kpiBenchmarks ?? [];
  const productKpis = pageData?.productKpis ?? [];

  // Get array of unique products
  const repeatedProducts = productKpis.map((productKpi) => productKpi.productCampaign.product);

  const products: Product[] = [];

  for (const product of repeatedProducts) {
    const id = product.id;
    if (!products.find((product) => product.id === id)) products.push(product);
  }

  products.sort((a, b) => a.id.localeCompare(b.id));

  // Get array of unique productCampaigns
  const repeatedProductCampaigns = productKpis.map((productKpi) => productKpi.productCampaign);

  const productCampaigns: ProductCampaign[] = [];

  for (const productCampaign of repeatedProductCampaigns) {
    const id = productCampaign.id;
    if (!productCampaigns.find((productCampaign) => productCampaign.id === id))
      productCampaigns.push(productCampaign);
  }

  // Get array of ProductKpis for selected products only
  const selectedProductKpis = productKpis.filter(
    (productKpi) => selectedProductIds?.find((id) => productKpi.productCampaign.product.id === id),
  );

  // Get harvested amount for a product
  const productHarvestedAmount = (productId: string) => {
    const harvestedProducts = productCampaigns.find(
      (productCampaign) =>
        productCampaign.productId === productId && productCampaign.harvestedAmount,
    );

    if (!harvestedProducts) return null;

    return productCampaigns
      .filter((productCampaign) => productCampaign.productId === productId)
      .reduce(
        (accumulator, productCampaign) => accumulator + (productCampaign.harvestedAmount ?? 0),
        0,
      );
  };

  // Get selected Kpi value for a product
  const productKpiValue = (productId: string) =>
    productKpis.reduce(
      (accumulator, productKpi) =>
        productKpi.kpiId === selectedKpi?.id && productKpi.productCampaign.product.id === productId
          ? accumulator + productKpi.totalValue
          : accumulator,
      0,
    );

  // Get array of all selectable products
  const allProducts: string[] = [];

  for (const product of products) {
    if (productHarvestedAmount(product.id)) allProducts.push(product.id);
  }

  // When query returns a value, sets the default selected Kpi and selected products
  useEffect(() => {
    if (pageData?.kpiBenchmarks?.[0] && !selectedKpi) {
      setSelectedKpi(pageData?.kpiBenchmarks?.[0]);
    }

    if (pageData?.productKpis && selectedProductIds.length === 0) {
      setSelectedProductIds(allProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData]);

  // Selected kpi value for all products
  const totalKpi = productKpis
    .map((productKpi) => (productKpi.kpiId === selectedKpi?.id ? productKpi.totalValue : 0))
    .reduce((accumulator, kpi) => accumulator + kpi, 0);

  // Total harvested amount (tons) of all selected products
  const selectedProductsAmount = productCampaigns
    .filter((productCampaign) => selectedProductIds.find((id) => id === productCampaign.productId))
    .reduce(
      (accumulator, productCampaign) => accumulator + (productCampaign.harvestedAmount ?? 0),
      0,
    );

  // Kpi value for selected products, given the KPI id
  const selectedProductsKpi = (kpiId: string) =>
    selectedProductKpis
      .map((productKpi) => (productKpi.kpiId === kpiId ? productKpi.totalValue : 0))
      .reduce((accumulator, productKpi) => accumulator + productKpi, 0) ?? 0;

  // Selected product's scopes
  const selectedProductsScopes = () => {
    const scopes = ["scope1", "scope2", "scope3"] as const;

    const scopesWithValues = scopes.map((scope, index) => ({
      name: `S${index + 1}`,
      value:
        totalKpi === 0
          ? 0
          : selectedProductKpis?.reduce(
              (accumulator, productKpi) => accumulator + (productKpi.scopes?.[scope] ?? 0),
              0,
            ) / totalKpi,
    }));

    return scopesWithValues;
  };

  // Selected product's waterFootprintComposition
  const selectedProductsWaterFootprints = () => {
    const footprints = ["blueFootprint", "greenFootprint"] as const;

    const footprintsWithValues = footprints.map((footprint) => ({
      name: t(`waterFootprints.${footprint}`),
      value: selectedProductKpis
        ?.filter((productKpi) => productKpi.waterComposition)
        .reduce(
          (accumulator, productKpi) =>
            accumulator +
            (productKpi.waterComposition?.[footprint] ?? 0) *
              ((productKpi.productCampaign.harvestedAmount ?? 0) / selectedProductsAmount),
          0,
        ),
    }));

    return footprintsWithValues;
  };

  // Calculate values to be displayed in bar chart, for certain product
  const barChartValues = (product: Product) => {
    let value;
    const harvestedAmount = productHarvestedAmount(product.id);

    if (mode === "absolute") {
      value = totalKpi === 0 ? 0 : (productKpiValue(product.id) / totalKpi) * 100;
    } else {
      value = !harvestedAmount ? 0 : productKpiValue(product.id) / harvestedAmount;
    }

    return value;
  };

  // Get dataset for bar chart
  const barChartData = productKpis && {
    datasets: [
      {
        data:
          mode === "intensity"
            ? products
                .filter((product) => !!productHarvestedAmount(product.id))
                .map((product) => ({
                  id: product.id,
                  label: translateField(product.name, locale),
                  value: barChartValues(product),
                }))
            : products.map((product) => ({
                id: product.id,
                label: translateField(product.name, locale),
                value: barChartValues(product),
              })),
      },
    ],
  };

  const findKpiKey = (kpiId: string) => kpiBenchmarks.find((item) => item.id === kpiId)?.key;

  // Get monitor card display value for a certain kpi, for all selected products
  const monitorCardAmount = (kpiId: string) => {
    const kpiKey = findKpiKey(kpiId);

    if (mode === "absolute" || (kpiKey && intensityKPI(kpiKey))) {
      return selectedProductsKpi(kpiId);
    }

    return selectedProductsAmount ? selectedProductsKpi(kpiId) / selectedProductsAmount : 0;
  };

  // Get kpi value / benchmark % for certain kpi, for all selected products
  const monitorCardVariation = (kpiId: string) => {
    const kpiKey = findKpiKey(kpiId);
    const benchmark = getSelectedProductsBenchmarkSum(kpiId);

    if (kpiKey && intensityKPI(kpiKey)) {
      return ((selectedProductsKpi(kpiId) - benchmark) / benchmark) * 100;
    }

    const selectedProductsIntensity = selectedProductsAmount
      ? selectedProductsKpi(kpiId) / selectedProductsAmount
      : 0;

    return ((selectedProductsIntensity - benchmark) / benchmark) * 100;
  };

  // Get benchmark value for a certain kpi, for all selected products
  const getSelectedProductsBenchmarkSum = (kpiId: string) => {
    const currentKpiBenchmarks =
      kpiBenchmarks
        .find((kpiBenchmark) => kpiBenchmark.id === kpiId)
        ?.organizationCampaignKpiBenchmarks.flatMap((item) => item.productKpiBenchmarks) ?? [];

    const benchmark = currentKpiBenchmarks.reduce((accumulator, productKpiBenchmark) => {
      if (selectedProductIds.includes(productKpiBenchmark.productId)) {
        accumulator += productKpiBenchmark.benchmark;
      }

      return accumulator;
    }, 0);

    return benchmark;
  };

  // Actions to preform when a product card is clicked
  const onProductCardClick = (productId: string) => {
    const item = selectedProductIds.find((id) => productId === id);

    if (selectedProductIds.length === allProducts.length) {
      return setSelectedProductIds([productId]);
    }

    if (item && selectedProductIds.length === 1) {
      return setSelectedProductIds(allProducts);
    }

    if (item) {
      const index = selectedProductIds.indexOf(productId);

      const updatedSelected = [
        ...selectedProductIds.slice(0, index),
        ...selectedProductIds.slice(index + 1),
      ];

      setSelectedProductIds(updatedSelected);
      return;
    }

    const updatedSelected = [...selectedProductIds, productId];
    setSelectedProductIds(updatedSelected);
  };

  // Boolean that indicates if a certain product is selected
  const isProductSelected = (productId: string) =>
    !!selectedProductIds.find((selectedId) => productId === selectedId);

  // Boolean that indicates if one of the selected products has an ongoing campaign (unharvested)
  const showOngoingCampaign = !!selectedProductKpis.find(
    (productKpi) => !productKpi.productCampaign.endDate,
  );

  // Check if all campaigns are uncompleted for selected products
  const noFinishedCampaigns = () => {
    const selectedProductCampaigns = productCampaigns.filter((item) =>
      selectedProductIds.includes(item.productId),
    );

    const finishedCampaigns = selectedProductCampaigns.find((item) => !!item.endDate);

    return !finishedCampaigns;
  };

  return {
    kpiBenchmarks,
    products,
    selectedKpi,
    setSelectedKpi,
    productHarvestedAmount,
    barChartData,
    monitorCardAmount,
    monitorCardVariation,
    selectedProductsScopes,
    selectedProductsWaterFootprints,
    onProductCardClick,
    showOngoingCampaign,
    noFinishedCampaigns,
    isProductSelected,
    pageDataLoading,
  };
};

export default useSummaryByProduct;
