import { type Dispatch, type SetStateAction } from "react";
import { type KpiCategory } from "@cacta/db";
import { useTranslations } from "next-intl";
import { ImSpinner2 } from "react-icons/im";

import { dateToString } from "~/utils/helperFunctions";
import { Card } from "~/components/atoms/Card";
import GradientText from "~/components/atoms/GradientText";
import Separator from "~/components/atoms/Separator";
import { Skeleton } from "~/components/atoms/Skeleton";
import ListCard from "~/components/molecules/ListCard";
import MonitorCard from "~/components/molecules/MonitorCard";
import SustainableGoals from "~/components/molecules/SustainableGoals";
import UncompletedCampaign from "~/components/molecules/UncompletedCampaign";
import BarChart from "~/components/organisms/BarChart";
import DoughnutChart from "~/components/organisms/DoughnutChart";
import FiltersBar from "~/components/organisms/FiltersBar";
import usePerformancePanel from "~/hooks/usePerformancePanel";

type PerformancePanelProps = {
  category: KpiCategory;
  selectedProductId?: string;
  setSelectedProductId: Dispatch<SetStateAction<string | undefined>>;
};

const Shimmer = () => (
  <div className="h-full w-full">
    <Card className="h-[137px] w-full px-4 py-3">
      <Skeleton className="mb-2 h-7 w-[150px]" />

      <div className="flex gap-6">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
      </div>

      <Separator className="m-2 border-dashed border-gray-300" />

      <div className="flex gap-6">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
      </div>
    </Card>

    <div className="mt-4 flex h-full flex-col gap-4 lg:flex-row">
      <Card className="w-full p-3 lg:w-2/3">
        <Skeleton className="h-11 w-[150px]" />

        <Separator className="m-1 border-dashed border-gray-300" />

        <div className="flex h-[calc(100%_-_50px)] flex-col justify-between lg:flex-row">
          <div className="flex w-full flex-col justify-between">
            <Skeleton className="h-[116px] w-full" />

            <div className="hidden w-full lg:flex">
              <Skeleton className="h-[65px] w-full" />
            </div>
          </div>

          <div className="flex h-fit min-h-[300px] w-full items-center justify-center lg:h-[calc(100vh_-_435px)] lg:max-w-[75%]">
            <ImSpinner2 size={120} className="animate-spin text-gray/200" />
          </div>

          <div className="mt-7 w-[250px] lg:hidden">
            <Skeleton className="h-[65px]" />
          </div>
        </div>
      </Card>

      <Card className="flex h-[500px] min-h-[380px] flex-col gap-4 p-4 lg:h-[calc(100vh_-_358px)] lg:w-1/3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    </div>
  </div>
);

const PerformancePanel = ({
  category,
  selectedProductId,
  setSelectedProductId,
}: PerformancePanelProps) => {
  const t = useTranslations();

  const {
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
  } = usePerformancePanel({
    category,
    selectedProductId,
    setSelectedProductId,
  });

  if (isLoading || !productsAndKpisList || !pageData) return <Shimmer />;

  if (productsAndKpisList.productsList.length === 0) {
    return (
      <div className="h-[calc(100vh_-_260px)] lg:h-[calc(100vh_-_210px)]">
        <UncompletedCampaign />
      </div>
    );
  }

  const disableActivityFilter =
    selectedKpi?.key === "UseOfElectricity" || selectedKpi?.key === "WaterFootprint";

  return (
    <>
      <FiltersBar
        products={productsAndKpisList?.productsList}
        selectedProduct={selectedProductId}
        setSelectedProduct={setSelectedProductId}
        kpis={kpisListFilter}
        selectedKpiIds={selectedKpiId}
        setSelectedKpiIds={setSelectedKpiId}
        activities={allActivities}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        disableActivityFilter={disableActivityFilter}
        multiselect={false}
      />

      <div className="mt-4 flex h-full flex-col gap-4 lg:flex-row">
        <Card className="w-full p-2 lg:min-w-[50%] lg:max-w-[70%]">
          <GradientText className="ml-2 py-2">
            {t("performancePerKpi.viewPanel.title")}
          </GradientText>

          <Separator className="m-1 border-dashed border-gray-300" />

          <div className="flex h-[calc(100%_-_50px)] flex-col justify-between xl:flex-row">
            <div className="flex w-[30%] flex-col justify-between">
              <div>
                {monitorCardValues().map((item, index) => (
                  <MonitorCard
                    key={index}
                    className="h-fit p-2"
                    title={item.title}
                    amount={item.amount}
                    unit={item.unit}
                    enableFooter={!!item.variation}
                    variation={item.variation}
                    isCard={false}
                  />
                ))}
              </div>

              <div className="hidden xl:flex">
                <SustainableGoals category={category} />
              </div>
            </div>

            <div className="flex h-fit w-full items-center xl:h-full xl:max-w-[70%]">
              <div className="min-h-[300px] w-full xl:h-[calc(100vh_-_435px)]">
                <DoughnutChart
                  chartData={doughnutChartData}
                  selectedActivities={selectedActivities}
                />
              </div>
            </div>

            <div className="mt-7 w-[250px] xl:hidden">
              <SustainableGoals category={category} />
            </div>
          </div>
        </Card>

        {selectedKpi?.key !== "WaterFootprint" ? (
          <div className="h-fit lg:h-[600px] lg:min-w-[30%] xl:h-[calc(100vh_-_358px)] xl:min-h-[365px]">
            {electricityDataCard ? (
              <ListCard
                title={t("performancePerKpi.viewPanel.generationSources")}
                data={electricityDataCard}
                showStages={false}
              />
            ) : (
              <ListCard
                title={t("performancePerKpi.viewPanel.inputContribution")}
                data={listCardData}
                showStages={true}
              />
            )}
          </div>
        ) : (
          <Card className="min-w-[40%] p-2">
            <div className="ml-3">
              <GradientText>{t("performancePerKpi.viewPanel.hydricBalance")}</GradientText>

              <p className="text-[11px] text-gray/500">
                {t("performancePerKpi.viewPanel.inmm")}.{" "}
                {t("performancePerKpi.viewPanel.campaign", {
                  startDate: dateToString(pageData.organizationCampaign.startDate, t),
                  endDate: dateToString(pageData.organizationCampaign.endDate, t),
                })}
              </p>
            </div>

            <Separator className="m-1 border-dashed border-gray-300" />

            <div className="min-h-[300px] lg:h-[calc(100%_-_50px)]">
              {barChartData && <BarChart chartData={barChartData} barWidth={30} labelsSize={10} />}
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default PerformancePanel;
