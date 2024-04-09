import React, { useState } from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";

import { loadMessages } from "~/utils/nextIntl";
import { type ModeType } from "~/utils/types";
import SwitchTabs from "~/components/molecules/SwitchTabs";
import NavigationTabs from "~/components/organisms/NavigationTabs";
import SummaryByProduct from "~/components/pages/monitor/SummaryByProduct";
import Layout from "~/components/templates/Layout";
import { getTrpcHelpers } from "~/server/helpers";
import { type NextPageWithLayout } from "../_app";

type SummaryByProductPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SummaryByProductPage: NextPageWithLayout<SummaryByProductPageProps> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof IntlMessages["navigationTab"]>("climateChange");

  const [selectedSwitchTab, setSelectedSwitchTab] = useState<ModeType>("absolute");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  return (
    <NavigationTabs
      switchTabs={
        <SwitchTabs
          key1="intensity"
          key2="absolute"
          setSelected={setSelectedSwitchTab}
          defaultValue="absolute"
        />
      }
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      tabs={[
        {
          key: "climateChange",
          content: (
            <SummaryByProduct
              mode={selectedSwitchTab}
              category="ClimateChange"
              showScopes
              selectedProductIds={selectedProductIds}
              setSelectedProductIds={setSelectedProductIds}
            />
          ),
        },
        {
          key: "ecosystemQuality",
          content: (
            <SummaryByProduct
              mode={selectedSwitchTab}
              category="EcosystemQuality"
              selectedProductIds={selectedProductIds}
              setSelectedProductIds={setSelectedProductIds}
            />
          ),
        },
        {
          key: "humanHealth",
          content: (
            <SummaryByProduct
              mode={selectedSwitchTab}
              category="HumanHealth"
              selectedProductIds={selectedProductIds}
              setSelectedProductIds={setSelectedProductIds}
            />
          ),
        },
        {
          key: "resourcesExhaustion",
          content: (
            <SummaryByProduct
              mode={selectedSwitchTab}
              category="ResourcesExhaustion"
              showWaterFootprints
              selectedProductIds={selectedProductIds}
              setSelectedProductIds={setSelectedProductIds}
            />
          ),
        },
      ]}
    />
  );
};

SummaryByProductPage.getLayout = (page) => <Layout titleKey="summaryByProduct">{page}</Layout>;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const helpers = await getTrpcHelpers(context);

  await Promise.all([
    helpers.monitor.summaryByProduct.prefetch({ category: "ClimateChange" }),
    helpers.monitor.summaryByProduct.prefetch({ category: "EcosystemQuality" }),
    helpers.monitor.summaryByProduct.prefetch({ category: "HumanHealth" }),
    helpers.monitor.summaryByProduct.prefetch({
      category: "ResourcesExhaustion",
    }),
  ]);

  return {
    props: {
      trpcState: helpers.dehydrate(),
      messages: await loadMessages(context.locale),
    },
  };
};

export default SummaryByProductPage;
