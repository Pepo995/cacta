import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Activity, type Input, type KpiCategory } from "@cacta/db";
import { useLocale, useTranslations } from "next-intl";

import { api } from "~/utils/api";
import { allActivities } from "~/utils/constants";
import { translateField } from "~/utils/getTranslation";
import { intensityKPI } from "~/utils/helperFunctions";
import { round } from "~/utils/mathHelpers";
import { type Stages } from "~/utils/types";

type UsePerformancePanelProps = {
  category: KpiCategory;
  selectedProductId?: string;
  setSelectedProductId: Dispatch<SetStateAction<string | undefined>>;
};

const usePerformancePanel = ({
  category,
  selectedProductId,
  setSelectedProductId,
}: UsePerformancePanelProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const [selectedKpiId, setSelectedKpiId] = useState<string>();
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  const { data: productsAndKpisList, isLoading: productsAndKpisListLoading } =
    api.analyze.productsAndKpisList.useQuery({
      category,
    });

  const kpisListFilter =
    productsAndKpisList?.kpisList.filter((kpi) => kpi.key !== "WaterProductivity") ?? [];

  useEffect(() => {
    if (productsAndKpisList) {
      if (!selectedProductId) {
        setSelectedProductId(productsAndKpisList.productsList[0]?.id);
      }

      if (!selectedKpiId) {
        setSelectedKpiId(kpisListFilter?.[0]?.id);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsAndKpisList]);

  const { data: pageData, isLoading: pageDataLoading } = api.analyze.performancePanel.useQuery({
    category,
    kpiIdFilter: selectedKpiId,
    productIdFilter: selectedProductId,
  });

  // Get selected kpi object
  const selectedKpi = productsAndKpisList?.kpisList.find((kpi) => kpi.id === selectedKpiId);

  // If kpi "Use of Electricity" is selected, get electricity data
  const { data: electricityData } = api.analyze.electricity.useQuery(
    {
      kpiIdFilter: selectedKpiId,
      productIdFilter: selectedProductId,
    },
    { enabled: selectedKpi?.key === "UseOfElectricity" },
  );

  // If kpi "Water Footprint" is selected, get water composition data
  const { data: waterCompositionData } = api.analyze.waterComposition.useQuery(
    {
      kpiIdFilter: selectedKpiId,
      productIdFilter: selectedProductId,
    },
    { enabled: selectedKpi?.key === "WaterFootprint" },
  );

  const benchmark = pageData?.benchmark;
  const selectedProductAmount = pageData?.selectedProductAmount ?? 0;
  const selectedKpiUnit = selectedKpi?.unit ?? "";
  const totalKpi = pageData?.totalKpi ?? 0;

  const activites: Activity[] =
    selectedActivities.length > 0 ? selectedActivities : pageData?.activitiesList ?? [];

  // Get kpi values grouped by activity, for selected product and kpi
  const kpisByActivity = allActivities.map((activity) => {
    const filteredActivityProductKpis = pageData?.activityProductKpis.filter(
      (activityProductKpi) => activityProductKpi.activity === activity,
    );

    const totalValue =
      filteredActivityProductKpis?.reduce(
        (accumulator, activityProductKpi) => accumulator + activityProductKpi.totalValue,
        0,
      ) ?? 0;

    return {
      activity,
      totalValue,
    };
  });

  // Get total kpi value for selected activities, selected kpi and for selected product
  const totalKpiSelectedActivities =
    kpisByActivity && kpisByActivity?.length > 0
      ? kpisByActivity?.reduce(
          (accumulator, kpi) =>
            activites.find((activity) => activity === kpi.activity)
              ? accumulator + kpi.totalValue
              : accumulator,
          0,
        )
      : totalKpi;

  // Sum absolute values of kpi for each activity (all activities)
  const totalKpiAbsoluteValues = kpisByActivity.reduce(
    (accumulator, kpi) => accumulator + Math.abs(kpi.totalValue),
    0,
  );

  // Sum absolute values of kpi for each selected activity
  const totalKpiSelectedActivitiesAbsoluteValue = kpisByActivity?.reduce(
    (accumulator, kpi) =>
      activites.find((activity) => activity === kpi.activity)
        ? accumulator + Math.abs(kpi.totalValue)
        : accumulator,
    0,
  );

  // Get input values grouped by activity, for selected product and kpi, and for selected activities
  const inputsByActivity = activites.map((activity) => {
    const filteredActivityInputs =
      pageData?.activityInputs.filter(
        (activityInput) => activityInput.activity.activity === activity,
      ) ?? [];

    const inputsList: Input[] = [];

    filteredActivityInputs.forEach((activityInput) => {
      !inputsList.some((uniqueInput) => uniqueInput.id === activityInput.inputId) &&
        inputsList.push(activityInput.input);
    });

    const inputs = inputsList.map((input) => {
      const stagesKpi = (stage: Stages | "totalValue") =>
        totalKpiSelectedActivities
          ? (filteredActivityInputs.reduce(
              (accumulator, activityInput) =>
                activityInput.inputId === input.id
                  ? accumulator + activityInput[stage]
                  : accumulator,
              0,
            ) /
              totalKpiSelectedActivitiesAbsoluteValue) *
            100
          : 0;

      return {
        id: input.id,
        name: translateField(input.name, locale),
        totalValue: stagesKpi("totalValue"),
        upstream: stagesKpi("upstream"),
        core: stagesKpi("core"),
        transportation: stagesKpi("transportation"),
      };
    });

    return {
      activity,
      inputs,
    };
  });

  // Get list card data
  const listCardData = inputsByActivity
    .map((inputByActivity) => inputByActivity.inputs)
    .flat()
    .filter((input) => input.totalValue !== 0)
    .sort((a, b) => Math.abs(b.totalValue) - Math.abs(a.totalValue));

  // Get selected kpi intensity (value / harvested amount) for selected product and for selected acitivites
  const kpiIntensity = totalKpiSelectedActivities / selectedProductAmount;

  // Get kpi value / benchmark % for selected kpi and selected product
  const kpiVsBenchmark =
    benchmark &&
    (((selectedKpi && intensityKPI(selectedKpi.key) ? totalKpiSelectedActivities : kpiIntensity) -
      benchmark) /
      benchmark) *
      100;

  const chartData = () => {
    if (electricityData) {
      return {
        data: electricityData.classification.map((item) => ({
          id: item.key,
          value: round(item.value),
        })),
        labels: electricityData.classification.map((item) => t(`electricity.${item.key}`)),
      };
    }

    if (waterCompositionData) {
      return {
        data: waterCompositionData.footprints.map((item) => ({
          id: item.key,
          value: round(item.value),
        })),
        labels: waterCompositionData.footprints.map((item) => t(`waterFootprints.${item.key}`)),
      };
    }

    return {
      data:
        kpisByActivity
          ?.sort((a, b) => Math.abs(b.totalValue) - Math.abs(a.totalValue))
          .map((kpi) => ({
            id: kpi.activity,
            value: round(Math.abs((kpi.totalValue / totalKpiAbsoluteValues) * 100)),
          })) ?? [],
      labels:
        kpisByActivity
          ?.sort((a, b) => Math.abs(b.totalValue) - Math.abs(a.totalValue))
          .map((kpi) => t(`filters.activity.${kpi.activity}`)) ?? [],
    };
  };

  // Get dataset for doughnut chart
  const doughnutChartData = {
    labels: chartData().labels,
    datasets: [
      {
        data: chartData().data,
      },
    ],
  };

  // Get dataset for water balance bar chart
  const barChartData = waterCompositionData && {
    datasets: [
      {
        data: waterCompositionData?.barChartData.map((item) => ({
          label: t(`waterComposition.${item.key}`).split("\n"),
          value: item.value,
        })),
      },
    ],
  };

  // Returns monitor card values for seleceted Kpi and selected product
  const monitorCardValues = () => {
    const selectedKpiMonitorCard = {
      title: translateField(selectedKpi?.name ?? [], locale),
      amount:
        selectedKpi && intensityKPI(selectedKpi.key) ? totalKpiSelectedActivities : kpiIntensity,
      unit: `${selectedKpiUnit} ${selectedKpi && intensityKPI(selectedKpi.key) ? `` : ` / ton`}`,
      variation: kpiVsBenchmark,
    };

    // Get water productivity kpi data
    const data = waterCompositionData?.waterProductivity;
    const benchmark = data?.benchmark;
    const variation = benchmark && (((data?.value ?? 0) - benchmark) / benchmark) * 100;

    const waterProductivityMonitorCard = {
      title: translateField(data?.name ?? [], locale),
      amount: data?.value ?? 0,
      unit: `${data?.unit ?? ""}`,
      variation: variation,
    };

    return selectedKpi?.key === "WaterFootprint"
      ? [selectedKpiMonitorCard, waterProductivityMonitorCard]
      : [selectedKpiMonitorCard];
  };

  // Get data for list card when "Use of Electricity" kpi is selected
  const electricityDataCard = electricityData?.electricitySources
    .map((data) => ({
      name: translateField(data.name, locale),
      value: (data.value / totalKpi) * 100,
      id: data.id,
    }))
    .filter((data) => data.value !== 0)
    .sort((a, b) => b.value - a.value);
  const isLoading = pageDataLoading || productsAndKpisListLoading;

  return {
    pageData,
    allActivities,
    electricityDataCard,
    productsAndKpisList,
    isLoading,
    selectedActivities,
    setSelectedActivities,
    selectedKpiId,
    setSelectedKpiId,
    kpisListFilter,
    selectedKpi,
    listCardData,
    doughnutChartData,
    monitorCardValues,
    barChartData,
  };
};

export default usePerformancePanel;
