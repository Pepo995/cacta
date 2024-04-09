import { useEffect, useState } from "react";
import { type KpiCategory } from "@cacta/db";
import { useLocale } from "next-intl";

import { api, type RouterOutputs } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { centerImageSize } from "~/components/organisms/PolarAreaChart";

type RouterKpi = RouterOutputs["homePage"]["homePageData"]["homePageData"][number];

export type Kpi = Omit<RouterKpi, "name, description"> & {
  name: string;
  description: string;
  products: {
    value: number;
    name: string;
  }[];
};

const getRelativePosition = (
  currentValue: number,
  targetValue: number,
  maxTargetValueFactor: number,
) => {
  const relativeValue =
    currentValue / targetValue > 1
      ? ((currentValue - targetValue) * 50) / (targetValue * (maxTargetValueFactor - 1)) + 50
      : (currentValue * 50) / targetValue;

  return relativeValue + centerImageSize;
};

export const indexToCategoryMap: KpiCategory[] = [
  "EcosystemQuality",
  "HumanHealth",
  "ResourcesExhaustion",
  "ClimateChange",
];

const usePolarChart = () => {
  const locale = useLocale();
  const { data, isLoading: dataLoading } = api.homePage.homePageData.useQuery();

  const [kpis, setKpis] = useState<Kpi[]>([]);
  const logoUrl = data?.logoUrl ?? "";

  useEffect(() => {
    if (data) {
      const dataWithTranslations = data.homePageData.map((kpi) => ({
        ...kpi,
        name: translateField(kpi.name, locale),
        description: translateField(kpi.description, locale),
        products: kpi.products.map((product) => ({
          ...product,
          name: translateField(product.name, locale),
        })),
      }));

      setKpis(dataWithTranslations);
    }
  }, [data, locale]);

  const maxTargetValueFactor = Math.max(
    Math.max(
      ...kpis.map((kpi) =>
        kpi.totalValue / kpi.benchmark <= 1 ? 1 : kpi.totalValue / kpi.benchmark,
      ),
    ),
    2,
  );

  const dataArray = {} as {
    [key in KpiCategory]: (Kpi | undefined)[];
  };

  indexToCategoryMap.map((category, categoryIndex) => {
    const categoryKpis = kpis.filter((kpi) => kpi.category === category);
    const categoryData = new Array<Kpi | undefined>(categoryKpis.length * 4).fill(undefined);

    categoryKpis?.map((kpi, index) => {
      categoryData[index + categoryKpis.length * categoryIndex] = kpi;
    });

    dataArray[category] = categoryData;
  });

  const polarChartData = {
    datasets: indexToCategoryMap.map((category) => ({
      data: dataArray[category].map((kpi) => {
        if (kpi) {
          return getRelativePosition(kpi.totalValue, kpi.benchmark, maxTargetValueFactor);
        }
        return 0;
      }),
      label: dataArray[category].map((kpi) => kpi?.name ?? ""),
    })),
  };

  const isLoading = dataLoading || !data;

  return { polarChartData, kpis, logoUrl, isLoading };
};

export default usePolarChart;
