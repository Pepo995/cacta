import React, { useEffect, useState } from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import { useLocale, useTranslations } from "next-intl";

import { api } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { dateToString } from "~/utils/helperFunctions";
import { loadMessages } from "~/utils/nextIntl";
import { Card } from "~/components/atoms/Card";
import GradientText from "~/components/atoms/GradientText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/atoms/SelectInput";
import Separator from "~/components/atoms/Separator";
import { Skeleton } from "~/components/atoms/Skeleton";
import InformationCard from "~/components/molecules/InformationCard";
import UncompletedCampaign from "~/components/molecules/UncompletedCampaign";
import EcoScoreCard from "~/components/organisms/EcoScoreCard";
import EcoScoreTable from "~/components/organisms/EcoScoreTable";
import Layout from "~/components/templates/Layout";
import { getTrpcHelpers } from "~/server/helpers";
import { type NextPageWithLayout } from "../_app";

type EcoScorePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Shimmer = () => {
  const t = useTranslations();

  return (
    <div className="flex h-full flex-col gap-4">
      <GradientText className="font-secondary text-2xl">{t("pageTitles.ecoScore")}</GradientText>

      <Card className="flex h-[289px] flex-col p-4 lg:h-[245px]">
        <div className="pb-2">
          <Skeleton className="mb-2 h-[25px] w-[250px]" />
          <Skeleton className="h-5 w-[200px]" />
          <Separator className="mt-3 border-dashed border-gray/300" />
        </div>

        <div className="mt-4 flex h-full w-full items-center justify-center">
          <Skeleton className="h-20 w-full max-w-[80%]" />
        </div>
      </Card>

      <div className="flex h-[calc(100vh_-_460px)] flex-col gap-2 lg:h-[calc(100vh_-_420px)]">
        <Card className="h-full p-4">
          <Skeleton className="mb-2 h-[25px] w-[250px]" />
          <Separator className="mb-5 mt-3 border-dashed border-gray/300" />

          <div className="mb-2 grid w-full grid-cols-5 place-items-center bg-gray/100 p-2 text-sm font-semibold">
            <p>{t("report.ecoScore.table.area")}</p>
            <p>{t("report.ecoScore.table.indicator")}</p>
            <p>{t("report.ecoScore.table.result")}</p>
            <p>{t("report.ecoScore.table.score")}</p>
            <p>{t("report.ecoScore.table.previousCampaign")}</p>
          </div>

          <div className="mb-2 grid w-full grid-cols-5 place-items-center p-2">
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton className="my-2 h-7 w-2/3" key={index} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const EcoScorePage: NextPageWithLayout<EcoScorePageProps> = () => {
  const t = useTranslations();
  const locale = useLocale();

  const [selectedCampaignId, setSelectedCampaingId] = useState<string>();
  const [selectedProductId, setSelectedProductId] = useState<string>();

  const { data: productsAndCampaigns, isLoading: productsAndCampaignsLoading } =
    api.report.productsAndCampaignsList.useQuery();

  useEffect(() => {
    if (productsAndCampaigns && !selectedCampaignId) {
      setSelectedCampaingId(productsAndCampaigns[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsAndCampaigns]);

  const { data: ecoScoreData, isLoading: ecoScoreLoading } = api.report.ecoScoreData.useQuery(
    {
      organizationCampaignId: selectedCampaignId,
      productId: selectedProductId,
    },
    { enabled: !!selectedCampaignId },
  );

  const selectedCampaign = productsAndCampaigns?.find(
    (campaign) => campaign.id === selectedCampaignId,
  );

  const productsList = selectedCampaign?.products;
  const listedProducts = productsList?.length ?? 0;
  const totalProducts = selectedCampaign?.totalProducts ?? 0;

  if (productsList?.length === 0) {
    return (
      <>
        <GradientText className="mb-4 font-secondary text-2xl">
          {t("pageTitles.ecoScore")}
        </GradientText>

        <div className="h-[calc(100vh_-_160px)]">
          <UncompletedCampaign />
        </div>
      </>
    );
  }

  if (productsAndCampaignsLoading || ecoScoreLoading) return <Shimmer />;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <GradientText className="font-secondary text-2xl">{t("pageTitles.ecoScore")}</GradientText>

        <div className="flex gap-3">
          <Select
            onValueChange={(value) => setSelectedCampaingId(value)}
            value={selectedCampaignId}
          >
            <SelectTrigger className="h-7 w-1/2 border-gray/500 text-xs text-gray/500 lg:w-[200px]">
              <SelectValue placeholder={t("report.ecoScore.selectCampaign")} />
            </SelectTrigger>

            <SelectContent>
              {productsAndCampaigns?.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  <p>
                    {dateToString(campaign.startDate, t)} - {dateToString(campaign.endDate, t)}
                  </p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              value === "allProducts"
                ? setSelectedProductId(undefined)
                : setSelectedProductId(value)
            }
            value={selectedProductId}
            key={selectedProductId}
          >
            <SelectTrigger className="h-7 w-1/2 border-gray/500 text-xs text-gray/500 lg:w-[200px]">
              <SelectValue placeholder={t("report.ecoScore.allProducts")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={"allProducts"} key={"allProducts"}>
                <p>{t("report.ecoScore.allProducts")}</p>
              </SelectItem>

              {productsList?.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <p>{translateField(product.name, locale)}</p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {ecoScoreData?.totalEcoScore && selectedCampaign && (
        <EcoScoreCard
          productName={productsList?.find((product) => product.id === selectedProductId)?.name}
          grade={ecoScoreData?.totalEcoScore?.ecoScoreGrade}
          percentage={ecoScoreData.totalEcoScore.ecoScoreValue}
          campaign={{
            startDate: dateToString(selectedCampaign?.startDate, t),
            endDate: dateToString(selectedCampaign?.endDate, t),
          }}
        />
      )}

      <div className="flex flex-col gap-2 lg:h-[calc(100vh_-_420px)]">
        <Card className="flex-1 overflow-hidden p-4">
          {ecoScoreData?.kpiEcoScores && <EcoScoreTable tableData={ecoScoreData.kpiEcoScores} />}
        </Card>

        {!selectedProductId && listedProducts !== totalProducts && (
          <InformationCard
            text={t("report.ecoScore.informationCard", {
              listedProducts,
              totalProducts,
            })}
          />
        )}
      </div>
    </div>
  );
};

EcoScorePage.getLayout = (page) => <Layout>{page}</Layout>;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const helpers = await getTrpcHelpers(context);

  await helpers.report.productsAndCampaignsList.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      messages: await loadMessages(context.locale),
    },
  };
};

export default EcoScorePage;
