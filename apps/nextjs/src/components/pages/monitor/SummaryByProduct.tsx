import React, { type Dispatch, type SetStateAction } from "react";
import { type KpiCategory } from "@cacta/db";
import { useLocale, useTranslations } from "next-intl";

import { imageUrlFromKey } from "~/utils/fileHelpers";
import { translateField } from "~/utils/getTranslation";
import { intensityKPI } from "~/utils/helperFunctions";
import { type ModeType } from "~/utils/types";
import { Card } from "~/components/atoms/Card";
import GradientText from "~/components/atoms/GradientText";
import { ScrollArea, ScrollBar } from "~/components/atoms/ScrollArea";
import Separator from "~/components/atoms/Separator";
import { Skeleton } from "~/components/atoms/Skeleton";
import BarChartGHGCard from "~/components/molecules/BarChartGHGCard";
import BarChartHydronicCard from "~/components/molecules/BarChartHydronicCard";
import InformationCard from "~/components/molecules/InformationCard";
import KPISelectBar from "~/components/molecules/KPISelectBar";
import MonitorCard from "~/components/molecules/MonitorCard";
import ProductCard from "~/components/molecules/ProductCard";
import UncompletedCampaign from "~/components/molecules/UncompletedCampaign";
import BarChart from "~/components/organisms/BarChart";
import useSummaryByProduct from "~/hooks/useSummaryByProduct";

const Shimmer = () => (
  <div className="flex h-full min-h-[calc(100vh_-_260px)] flex-col gap-4 lg:flex-row">
    <div className="flex h-full w-full flex-col gap-y-4 lg:w-2/3">
      <Card className="h-[126px] pr-2 2xl:h-fit 2xl:max-h-[234px]">
        <div className="flex h-full flex-wrap gap-x-4 gap-y-4 overflow-hidden px-4 py-4">
          <Skeleton className="h-[94px] w-[200px]" />
          <Skeleton className="h-[94px] w-[200px]" />
          <Skeleton className="h-[94px] w-[200px]" />
        </div>
      </Card>

      <Card className="flex h-full flex-col gap-2 p-4 lg:h-[calc(100vh_-_348px)] lg:max-h-[650px] lg:min-h-[380px]">
        <Skeleton className="h-[25px] w-[300px]" />
        <Skeleton className="h-[25px] w-[200px]" />
        <Skeleton className="mt-2 h-10 w-full" />
        <Skeleton className="h-[calc(100%_-_105px)] max-h-[400px] min-h-[200px] lg:max-h-[500px]" />
      </Card>
    </div>

    <div className="flex min-h-[518px] flex-col gap-y-4 lg:w-1/3">
      <Card className="h-fit max-h-full min-h-[300px] overflow-visible px-2 py-4 lg:h-[calc(100vh_-_210px)]">
        <Skeleton className="mb-4 h-[30px] w-[200px]" />

        <div className="flex h-full flex-col gap-4 pb-4">
          <Skeleton className="h-[140px] w-full" />
          <Skeleton className="h-[140px] w-full" />
          <Skeleton className="h-[140px] w-full" />
        </div>
      </Card>
    </div>
  </div>
);

type SummaryByProductProps = {
  mode: ModeType;
  category: KpiCategory;
  showScopes?: boolean;
  showWaterFootprints?: boolean;
  selectedProductIds: string[];
  setSelectedProductIds: Dispatch<SetStateAction<string[]>>;
};

const SummaryByProduct = ({
  mode,
  category,
  showScopes,
  showWaterFootprints,
  selectedProductIds,
  setSelectedProductIds,
}: SummaryByProductProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const {
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
  } = useSummaryByProduct({ mode, category, selectedProductIds, setSelectedProductIds });

  const isLoading = pageDataLoading || !selectedKpi;

  if (isLoading) return <Shimmer />;

  if (noFinishedCampaigns()) {
    return (
      <div className="h-[calc(100vh_-_260px)] lg:h-[calc(100vh_-_210px)]">
        <UncompletedCampaign />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-4 lg:flex-row">
      <div className="flex flex-col gap-4 lg:w-2/3">
        <Card className="w-full">
          <ScrollArea>
            <div className="flex h-full w-full gap-x-4 gap-y-4 px-4 py-4">
              {products?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={translateField(product.name, locale)}
                  amount={productHarvestedAmount(product.id)}
                  imageUrl={imageUrlFromKey(product.imageS3Key)}
                  selected={isProductSelected(product.id)}
                  onClick={() => onProductCardClick(product.id)}
                  disabled={!productHarvestedAmount(product.id)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>

        <Card className="h-full p-4 lg:h-[calc(100vh_-_348px)] lg:max-h-[650px] lg:min-h-[380px]">
          <GradientText>{t("monitor.summaryByProduct.productPerformance")}</GradientText>

          <p className="mb-4 text-xs text-gray/600">
            {mode === "absolute"
              ? t("monitor.summaryByProduct.productContribution")
              : t("monitor.summaryByProduct.productImpact", {
                  unit: `${selectedKpi.unit}${intensityKPI(selectedKpi.key) ? `` : ` / ton`}`,
                })}
          </p>

          <KPISelectBar
            kpis={kpiBenchmarks}
            selectedKpi={selectedKpi}
            setSelectedKpi={setSelectedKpi}
          />

          {selectedProductIds.length === 0 ? (
            <div className="flex h-[calc(100vh_-_480px)] max-h-[400px] min-h-[200px] items-center justify-center rounded-lg border border-gray/200 bg-gray/100 lg:max-h-[500px]">
              <p className="text-sm text-gray/500">{t("monitor.summaryByProduct.pleaseSelect")}</p>
            </div>
          ) : (
            <div className="h-[calc(100%_-_105px)] max-h-[400px] min-h-[200px] lg:max-h-[500px]">
              <BarChart
                chartData={barChartData}
                selectedProductIds={selectedProductIds}
                mode={mode}
                unit={mode === "absolute" ? "%" : ""}
              />
            </div>
          )}
        </Card>
      </div>

      <div className="flex min-h-[518px] flex-col gap-y-4 lg:max-h-[calc(100vh_-_210px)] lg:w-1/3">
        <Card className="h-fit max-h-full min-h-[300px] overflow-visible px-2 py-4">
          <p className="mb-4 px-4 font-bold text-gray/600">
            {t("monitor.summaryByProduct.kpiResults")}
          </p>

          <ScrollArea className="h-[calc(100%_-_40px)]">
            {kpiBenchmarks.map((kpi, index) => (
              <React.Fragment key={kpi.id}>
                <div className="hover:cursor-pointer" onClick={() => setSelectedKpi(kpi)}>
                  <MonitorCard
                    title={translateField(kpi.name, locale)}
                    amount={monitorCardAmount(kpi.id)}
                    unit={
                      mode === "absolute" || intensityKPI(kpi.key) ? kpi.unit : `${kpi.unit} / ton`
                    }
                    variation={monitorCardVariation(kpi.id)}
                    isCard={false}
                    selected={selectedKpi?.id === kpi.id}
                    enableFooter={kpi.organizationCampaignKpiBenchmarks.length > 0}
                  />
                </div>

                {kpiBenchmarks.length - 1 !== index && (
                  <Separator className="mx-2 my-4 border-dashed border-gray/400" />
                )}
              </React.Fragment>
            ))}

            {showScopes && (
              <>
                <Separator className="mx-2 my-4 border-dashed border-gray/400" />

                <div className="px-4">
                  {selectedProductIds.length === 0 ? (
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-bold">{t("cards.barChartGHGCard.title")}</p>

                        <p className="text-xs">{t("cards.barChartGHGCard.subtitle")}</p>
                      </div>

                      <div className="flex h-[68px] items-center justify-center rounded-lg bg-gray/100">
                        <p className="text-center text-xs text-gray/500">
                          {t("monitor.summaryByProduct.pleaseSelect")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <BarChartGHGCard items={selectedProductsScopes()} showInformation />
                  )}
                </div>
              </>
            )}

            {showWaterFootprints && (
              <>
                <Separator className="mx-2 my-4 border-dashed border-gray/400" />

                {selectedProductIds.length === 0 ? (
                  <div className="flex w-full flex-col gap-4 p-6">
                    <p className="mb-2 font-bold ">{t("cards.barChartHydronicCard.title")}</p>

                    <div className="flex h-[52px] items-center justify-center rounded-lg bg-gray/100">
                      <p className="text-center text-xs text-gray/500">
                        {t("monitor.summaryByProduct.pleaseSelect")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <BarChartHydronicCard items={selectedProductsWaterFootprints()} />
                  </div>
                )}
              </>
            )}
          </ScrollArea>
        </Card>

        {showOngoingCampaign && (
          <InformationCard text={t("monitor.summaryByProduct.ongoingCampaignMessage")} />
        )}
      </div>
    </div>
  );
};

export default SummaryByProduct;
