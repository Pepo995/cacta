import React, { useState } from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";

import { loadMessages } from "~/utils/nextIntl";
import { type ModeType } from "~/utils/types";
import { type MapEstablishment } from "~/components/molecules/Map";
import SwitchTabs from "~/components/molecules/SwitchTabs";
import NavigationTabs from "~/components/organisms/NavigationTabs";
import SummaryByEstablishment from "~/components/pages/monitor/SummaryByEstablishment";
import Layout from "~/components/templates/Layout";
import { getTrpcHelpers } from "~/server/helpers";
import { type NextPageWithLayout } from "../_app";

type SummaryByEstablishmentPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SummaryByEstablishmentPage: NextPageWithLayout<SummaryByEstablishmentPageProps> = () => {
  const [selectedSwitchTab, setSelectedSwitchTab] = useState<ModeType>("absolute");

  const [selectedTab, setSelectedTab] =
    useState<keyof IntlMessages["navigationTab"]>("climateChange");

  const [selectedEstablishment, setSelectedEstablishment] = useState<MapEstablishment>();

  return (
    selectedTab && (
      <NavigationTabs
        switchTabs={
          <SwitchTabs
            key1="intensity"
            key2="absolute"
            setSelected={setSelectedSwitchTab}
            defaultValue="absolute"
          />
        }
        className="w-full"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={[
          {
            key: "climateChange",
            content: (
              <SummaryByEstablishment
                selectedSwitchTab={selectedSwitchTab}
                category="ClimateChange"
                showScopes={true}
                selectedEstablishment={selectedEstablishment}
                setSelectedEstablishment={setSelectedEstablishment}
              />
            ),
          },
          {
            key: "ecosystemQuality",
            content: (
              <SummaryByEstablishment
                selectedSwitchTab={selectedSwitchTab}
                category="EcosystemQuality"
                selectedEstablishment={selectedEstablishment}
                setSelectedEstablishment={setSelectedEstablishment}
              />
            ),
          },
          {
            key: "humanHealth",
            content: (
              <SummaryByEstablishment
                selectedSwitchTab={selectedSwitchTab}
                category="HumanHealth"
                selectedEstablishment={selectedEstablishment}
                setSelectedEstablishment={setSelectedEstablishment}
              />
            ),
          },
          {
            key: "resourcesExhaustion",
            content: (
              <SummaryByEstablishment
                selectedSwitchTab={selectedSwitchTab}
                category="ResourcesExhaustion"
                selectedEstablishment={selectedEstablishment}
                setSelectedEstablishment={setSelectedEstablishment}
              />
            ),
          },
        ]}
      />
    )
  );
};

SummaryByEstablishmentPage.getLayout = (page) => (
  <Layout titleKey="summaryByEstablishment">{page}</Layout>
);

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const helpers = await getTrpcHelpers(context);

  await Promise.all([
    helpers.monitor.summaryByEstablishment.prefetch({
      category: "ClimateChange",
    }),
    helpers.monitor.summaryByEstablishment.prefetch({
      category: "EcosystemQuality",
    }),
    helpers.monitor.summaryByEstablishment.prefetch({
      category: "HumanHealth",
    }),
    helpers.monitor.summaryByEstablishment.prefetch({
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

export default SummaryByEstablishmentPage;
