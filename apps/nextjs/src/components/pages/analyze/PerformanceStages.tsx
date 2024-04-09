import { type Dispatch, type SetStateAction } from "react";
import { type KpiCategory } from "@cacta/db";
import { useTranslations } from "next-intl";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import { type ChartDataBarChart } from "~/utils/chartTypes";
import { allActivities } from "~/utils/constants";
import { Card } from "~/components/atoms/Card";
import GradientText from "~/components/atoms/GradientText";
import Separator from "~/components/atoms/Separator";
import { Skeleton } from "~/components/atoms/Skeleton";
import UncompletedCampaign from "~/components/molecules/UncompletedCampaign";
import BarChart from "~/components/organisms/BarChart";
import FiltersBar from "~/components/organisms/FiltersBar";
import usePerformanceStages from "~/hooks/usePerformanceStages";

type PerformanceStagesProps = {
  category: KpiCategory;
  selectedProductId?: string;
  setSelectedProductId: Dispatch<SetStateAction<string | undefined>>;
};

const ShimmerCardComponent = () => (
  <Card className="w-full p-4 lg:w-1/3">
    <Skeleton className="h-10 w-full" />

    <Separator className="m-1 border-dashed border-gray-300" />

    <div className="mt-2 h-[350px] w-full lg:h-[calc(100vh_-_440px)] lg:min-h-[260px]">
      <Skeleton className="h-full w-full" />
    </div>
  </Card>
);

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

    <div className="mt-4 flex flex-col gap-4 lg:flex-row">
      <ShimmerCardComponent />
      <ShimmerCardComponent />
      <ShimmerCardComponent />
    </div>
  </div>
);

type CardComponentProps = {
  title: string;
  barChartData: ChartDataBarChart;
  showArrows?: boolean;
  kpisSelected: boolean;
};

const CardComponent = ({
  title,
  barChartData,
  showArrows = true,
  kpisSelected,
}: CardComponentProps) => {
  const t = useTranslations();

  return (
    <Card className="w-full overflow-hidden p-4 lg:w-1/3">
      <div className="flex w-full justify-between">
        <div className="flex w-[70%] flex-col">
          <GradientText className="truncate">{title}</GradientText>

          <p className="truncate text-[11px] text-gray/500">
            {t("performancePerKpi.viewStages.chartSubTitle")}
          </p>
        </div>

        {showArrows && (
          <div className="flex items-center justify-center ">
            <MdOutlineArrowForwardIos className="relative left-6 text-secondary" size={30} />

            <MdOutlineArrowForwardIos className="relative left-3 text-secondary" size={30} />

            <MdOutlineArrowForwardIos className="relative text-secondary" size={30} />
          </div>
        )}
      </div>

      <Separator className="m-1 border-dashed border-gray-300" />

      <div className="mt-2 h-[350px] w-full lg:h-[calc(100vh_-_440px)] lg:min-h-[260px]">
        {!kpisSelected ? (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-gray/200 bg-gray/100">
            <p className="text-sm text-gray/500">
              {t("performancePerKpi.viewStages.pleaseSelectKpi")}
            </p>
          </div>
        ) : (
          <BarChart
            maxYValue={100}
            labelsSize={9}
            barWidth={30}
            chartData={barChartData}
            unit="%"
          />
        )}
      </div>
    </Card>
  );
};

const PerformanceStages = ({
  category,
  selectedProductId,
  setSelectedProductId,
}: PerformanceStagesProps) => {
  const t = useTranslations();

  const {
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
  } = usePerformanceStages({
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

  return (
    <>
      <FiltersBar
        products={productsAndKpisList.productsList}
        selectedProduct={selectedProductId}
        setSelectedProduct={setSelectedProductId}
        kpis={productsAndKpisList.kpisList}
        selectedKpiIds={selectedKpiIds}
        setSelectedKpiIds={setSelectedKpiIds}
        activities={allActivities}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        multiselect={true}
      />

      <div className="mt-4 flex w-full flex-col gap-4 lg:flex-row">
        <CardComponent
          title={t("performancePerKpi.viewStages.step1Title")}
          barChartData={stage1barChartData}
          kpisSelected={selectedKpiIds.length !== 0}
          key={`stage-1-${selectedKpiIds.length}`}
        />

        <CardComponent
          title={t("performancePerKpi.viewStages.step2Title")}
          barChartData={stage2barChartData}
          kpisSelected={selectedKpiIds.length !== 0}
          key={`stage-2-${selectedKpiIds.length}`}
        />

        <CardComponent
          title={t("performancePerKpi.viewStages.step3Title")}
          barChartData={stage3barChartData}
          showArrows={false}
          kpisSelected={selectedKpiIds.length !== 0}
          key={`stage-3-${selectedKpiIds.length}`}
        />
      </div>
    </>
  );
};

export default PerformanceStages;
