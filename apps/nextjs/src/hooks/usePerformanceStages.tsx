import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Activity, type KpiCategory } from "@cacta/db";
import { useLocale } from "next-intl";

import { api } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { type Stages } from "~/utils/types";

type UsePerformanceStagesProps = {
  category: KpiCategory;
  selectedProductId?: string;
  setSelectedProductId: Dispatch<SetStateAction<string | undefined>>;
};

const usePerformanceStages = ({
  category,
  selectedProductId,
  setSelectedProductId,
}: UsePerformanceStagesProps) => {
  const locale = useLocale();

  const [selectedKpiIds, setSelectedKpiIds] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  const { data: productsAndKpisList, isLoading: productsAndKpisListLoading } =
    api.analyze.productsAndKpisList.useQuery({
      category,
    });

  useEffect(() => {
    if (productsAndKpisList) {
      if (!selectedProductId) {
        setSelectedProductId(productsAndKpisList.productsList[0]?.id);
      }

      if (selectedKpiIds.length === 0) {
        setSelectedKpiIds(productsAndKpisList.kpisList.map((kpi) => kpi.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsAndKpisList]);

  const { data: pageData, isLoading: pageDataLoading } = api.analyze.performanceStages.useQuery({
    category,
    productIdFilter: selectedProductId,
  });

  // Get value for each stage separated by kpi, for all activities
  const stagesTotal = pageData?.activityProductKpisByKpi.map((kpi) => {
    const total = kpi.activityProductKpis.reduce(
      (accumulator, activityProductKpi) => accumulator + Math.abs(activityProductKpi.totalValue),
      0,
    );

    const stageKpi = (stage: Stages) =>
      kpi.activityProductKpis.reduce(
        (accumulator, activityProductKpi) =>
          accumulator +
          activityProductKpi.activityInputs.reduce(
            (accumulator, activiyInput) => accumulator + Math.abs(activiyInput[stage]),
            0,
          ),
        0,
      );

    return {
      kpiId: kpi.kpiId,
      upstream: (stageKpi("upstream") / total) * 100,
      core: (stageKpi("core") / total) * 100,
      transportation: (stageKpi("transportation") / total) * 100,
    };
  });

  // Get value for each stage separated by kpi, for selected activities activities
  const stagesSelectedActivities = pageData?.activityProductKpisByKpi.map((kpi) => {
    const total = kpi.activityProductKpis.reduce(
      (accumulator, activityProductKpi) => accumulator + Math.abs(activityProductKpi.totalValue),
      0,
    );

    const stageKpi = (stage: Stages) =>
      kpi.activityProductKpis.reduce(
        (accumulator, activityProductKpi) =>
          selectedActivities.some((activity) => activity === activityProductKpi.activity) ||
          selectedActivities.length === 0
            ? accumulator +
              activityProductKpi.activityInputs.reduce(
                (accumulator, activiyInput) => accumulator + Math.abs(activiyInput[stage]),
                0,
              )
            : accumulator,
        0,
      );

    return {
      kpiId: kpi.kpiId,
      upstream: total > 0 ? (stageKpi("upstream") / total) * 100 : 0,
      core: total > 0 ? (stageKpi("core") / total) * 100 : 0,
      transportation: total > 0 ? (stageKpi("transportation") / total) * 100 : 0,
    };
  });

  // Get kpi names in arrya format for charts
  const kpiNames = productsAndKpisList?.kpisList.map((kpi) => ({
    id: kpi.id,
    name:
      selectedKpiIds.length > 2
        ? translateField(kpi.name, locale).split(/[\s-]+/)
        : translateField(kpi.name, locale),
  }));

  // Generate bar chart data given a stage
  const generateStageDataset = (stage: Stages) => ({
    datasets: [
      {
        data: selectedKpiIds.map((kpiId) => ({
          label: kpiNames?.find((kpi) => kpi.id === kpiId)?.name ?? "",
          value: stagesSelectedActivities?.find((item) => item.kpiId === kpiId)?.[stage] ?? 0,
        })),
      },
      {
        data: selectedKpiIds.map((kpiId) => ({
          label: kpiNames?.find((kpi) => kpi.id === kpiId)?.name ?? "",
          value: stagesTotal?.find((item) => item.kpiId === kpiId)?.[stage] ?? 0,
        })),
      },
    ],
  });

  const stage1barChartData = generateStageDataset("upstream");
  const stage2barChartData = generateStageDataset("transportation");
  const stage3barChartData = generateStageDataset("core");

  const isLoading = productsAndKpisListLoading || pageDataLoading;

  return {
    pageData,
    productsAndKpisList,
    isLoading,
    selectedActivities,
    setSelectedActivities,
    selectedKpiIds,
    setSelectedKpiIds,
    stage1barChartData,
    stage2barChartData,
    stage3barChartData,
  };
};

export default usePerformanceStages;
