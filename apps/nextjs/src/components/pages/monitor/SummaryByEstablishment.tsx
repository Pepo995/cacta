import { type Dispatch, type SetStateAction } from "react";
import { type KpiCategory } from "@cacta/db";
import { useLocale, useTranslations } from "next-intl";

import { translateField } from "~/utils/getTranslation";
import { intensityKPI } from "~/utils/helperFunctions";
import { Card } from "~/components/atoms/Card";
import { Skeleton } from "~/components/atoms/Skeleton";
import BarChartGHGCard from "~/components/molecules/BarChartGHGCard";
import InformationCard from "~/components/molecules/InformationCard";
import MapCard, { type MapEstablishment } from "~/components/molecules/Map";
import MetricsCard from "~/components/molecules/MetricsCard";
import MonitorCard from "~/components/molecules/MonitorCard";
import UncompletedCampaign from "~/components/molecules/UncompletedCampaign";
import useSummaryByEstablishment from "~/hooks/useSummaryByEstablishment";
import { cn } from "~/utils";

type SummaryByEstablishmentProps = {
  selectedSwitchTab?: keyof IntlMessages["switchTabs"];
  category: KpiCategory;
  showScopes?: boolean;
  selectedEstablishment?: MapEstablishment;
  setSelectedEstablishment: Dispatch<SetStateAction<MapEstablishment | undefined>>;
};

const Shimmer = () => (
  <div className="flex h-full flex-col gap-3 lg:flex-row">
    <div className="flex flex-col gap-3 lg:w-[60%]">
      <Card className="w-full p-4">
        <Skeleton className="h-[100px]" />
      </Card>

      <Card className="w-full p-4">
        <Skeleton className="h-[100px]" />
      </Card>

      <Card className="flex flex-col justify-between gap-10 p-4 font-secondary sm:flex-row">
        <div className="sm:w-1/2">
          <Skeleton className="mb-4 h-[25px]" />
          <Skeleton className="h-[200px]" />
        </div>

        <div className="sm:w-1/2">
          <Skeleton className="mb-4 h-[25px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </Card>
    </div>

    <Card className="flex flex-col gap-4 p-4 lg:w-[40%]">
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-full min-h-[250px] w-full" />
    </Card>
  </div>
);

const SummaryByEstablishment = ({
  selectedSwitchTab,
  category,
  showScopes = false,
  selectedEstablishment,
  setSelectedEstablishment,
}: SummaryByEstablishmentProps) => {
  const locale = useLocale();
  const t = useTranslations();

  const {
    filteredData,
    toDMS,
    pageDataLoading,
    establishmentsCampaign,
    showOngoingCampaign,
    noFinishedCampaigns,
  } = useSummaryByEstablishment({ category, selectedEstablishment });

  const isLoading = pageDataLoading || !establishmentsCampaign || !filteredData;

  if (isLoading) return <Shimmer />;

  if (noFinishedCampaigns()) {
    return (
      <div className="h-[calc(100vh_-_260px)] lg:h-[calc(100vh_-_210px)]">
        <UncompletedCampaign />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3 lg:flex-row">
      <div className="flex w-full flex-col gap-3 lg:w-[60%]">
        <div className={cn("grid gap-1", filteredData.kpiValues.length > 1 && "lg:grid-cols-2")}>
          {filteredData.kpiValues
            .filter((kpi) => kpi.key !== "WaterProductivity")
            .map(({ name, value, id, unit, key }) => (
              <MonitorCard
                key={id}
                amount={
                  selectedSwitchTab !== "absolute" && !intensityKPI(key)
                    ? value / filteredData.totalHarvestedArea
                    : value
                }
                unit={
                  selectedSwitchTab !== "absolute" && !intensityKPI(key) ? `${unit} / ha ` : unit
                }
                enableFooter={false}
                title={translateField(name, locale)}
              />
            ))}
        </div>

        {showScopes && (
          <Card className="w-full p-4">
            <BarChartGHGCard
              items={[
                {
                  name: "S1",
                  value: filteredData?.scopes?.scope1 ?? 0,
                },
                {
                  name: "S2",
                  value: filteredData?.scopes?.scope2 ?? 0,
                },
                {
                  name: "S3",
                  value: filteredData?.scopes?.scope3 ?? 0,
                },
              ]}
              showInformation
            />
          </Card>
        )}

        <MetricsCard
          area={filteredData.area}
          crops={filteredData.products.map((product) => ({
            cropName: translateField(product.name, locale),
            cropArea: product.area,
          }))}
          latitude={toDMS(filteredData.latitude, false)}
          longitude={toDMS(filteredData.longitude, true)}
          soilType={filteredData.soilType}
          ph={filteredData.soilPH ?? undefined}
          organicMaterial={filteredData.organicMaterial ?? undefined}
          nitrogen={filteredData.nitrogen ?? undefined}
          phosphorus={filteredData.phosphorous ?? undefined}
        />
      </div>

      <div className="flex w-full flex-col gap-2 lg:w-[40%]">
        <MapCard
          selectedEstablishment={selectedEstablishment}
          setSelectedEstablishment={setSelectedEstablishment}
          establishments={establishmentsCampaign.map(({ establishment, establishmentId }) => ({
            id: establishmentId,
            name: establishment.name,
            latitude: establishment.latitude,
            longitude: establishment.longitude,
          }))}
        />

        {showOngoingCampaign() && (
          <InformationCard text={t("monitor.summaryByProduct.ongoingCampaignMessage")} />
        )}
      </div>
    </div>
  );
};

export default SummaryByEstablishment;
