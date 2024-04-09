import React, { useState } from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";

import { loadMessages } from "~/utils/nextIntl";
import { type ViewType } from "~/utils/types";
import SwitchTabs from "~/components/molecules/SwitchTabs";
import NavigationTabs from "~/components/organisms/NavigationTabs";
import PerformancePanel from "~/components/pages/analyze/PerformancePanel";
import PerformanceStages from "~/components/pages/analyze/PerformanceStages";
import Layout from "~/components/templates/Layout";
import { getTrpcHelpers } from "~/server/helpers";
import { type NextPageWithLayout } from "../_app";

type PerofrmancePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PerofrmancePage: NextPageWithLayout<PerofrmancePageProps> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof IntlMessages["navigationTab"]>("climateChange");

  const [selectedSwitchTab, setSelectedSwitchTab] = useState<ViewType>("viewPanel");
  const [selectedProductId, setSelectedProductId] = useState<string>();

  return (
    <NavigationTabs
      switchTabs={
        <SwitchTabs
          key1="viewPanel"
          key2="viewStages"
          setSelected={setSelectedSwitchTab}
          defaultValue="viewPanel"
        />
      }
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      tabs={[
        {
          key: "climateChange",
          content:
            selectedSwitchTab === "viewPanel" ? (
              <PerformancePanel
                category="ClimateChange"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ) : (
              <PerformanceStages
                category="ClimateChange"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ),
        },
        {
          key: "ecosystemQuality",
          content:
            selectedSwitchTab === "viewPanel" ? (
              <PerformancePanel
                category="EcosystemQuality"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ) : (
              <PerformanceStages
                category="EcosystemQuality"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ),
        },
        {
          key: "humanHealth",
          content:
            selectedSwitchTab === "viewPanel" ? (
              <PerformancePanel
                category="HumanHealth"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ) : (
              <PerformanceStages
                category="HumanHealth"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ),
        },
        {
          key: "resourcesExhaustion",
          content:
            selectedSwitchTab === "viewPanel" ? (
              <PerformancePanel
                category="ResourcesExhaustion"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ) : (
              <PerformanceStages
                category="ResourcesExhaustion"
                setSelectedProductId={setSelectedProductId}
                selectedProductId={selectedProductId}
              />
            ),
        },
      ]}
    />
  );
};

PerofrmancePage.getLayout = (page) => <Layout titleKey="performancePerKpi">{page}</Layout>;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const helpers = await getTrpcHelpers(context);

  await Promise.all([
    helpers.analyze.productsAndKpisList.prefetch({ category: "ClimateChange" }),
    helpers.analyze.productsAndKpisList.prefetch({ category: "HumanHealth" }),
    helpers.analyze.productsAndKpisList.prefetch({ category: "EcosystemQuality" }),
    helpers.analyze.productsAndKpisList.prefetch({ category: "ResourcesExhaustion" }),
  ]);

  return {
    props: {
      trpcState: helpers.dehydrate(),
      messages: await loadMessages(context.locale),
    },
  };
};

export default PerofrmancePage;
