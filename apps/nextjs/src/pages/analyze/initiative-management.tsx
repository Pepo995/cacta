import React, { useState } from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import { useTranslations } from "next-intl";

import { api } from "~/utils/api";
import { loadMessages } from "~/utils/nextIntl";
import type { InitiativeType } from "~/utils/types";
import { Button } from "~/components/atoms/Button";
import Header from "~/components/molecules/TablesCustomHeader";
import { DataTable } from "~/components/organisms/DataTable";
import InitiativeModal from "~/components/organisms/InitiativeModal";
import NavigationTabs from "~/components/organisms/NavigationTabs";
import FilterBar from "~/components/organisms/TableFilterBar";
import Layout from "~/components/templates/Layout";
import useInitiativeManagement from "~/hooks/useInitiativeManagement";
import { getTrpcHelpers } from "~/server/helpers";
import { type NextPageWithLayout } from "../_app";

type InitiativeManagementPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const InitiativeManagementPage: NextPageWithLayout<InitiativeManagementPageProps> = ({
  initialQuery,
}) => {
  const t = useTranslations();

  const [selectedTab, setSelectedTab] =
    useState<keyof IntlMessages["navigationTab"]>("actualInitiatives");

  const { data: modalData } = api.initiative.getInitiativesModalData.useQuery();

  return (
    <>
      <NavigationTabs
        switchTabs={
          <div>
            <InitiativeModal
              modalData={modalData}
              title={t("analyze.initiativeManagement.newInitiative")}
              triggerButton={
                <Button className="h-[40px]" type="submit">
                  {t("analyze.initiativeManagement.newInitiative")}
                </Button>
              }
              confirmButtonText={t("analyze.initiativeManagement.createInitiative")}
              cancelButtonText={t("analyze.initiativeManagement.dismissInitiative")}
              modalDescription={t("analyze.initiativeManagement.modalDescription")}
            />
          </div>
        }
        className="w-full"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={[
          {
            key: "actualInitiatives",
            content: (
              <InitiativesTable
                type="actual"
                tableKey="actual"
                initialQuery={initialQuery.actual}
              />
            ),
          },
          {
            key: "pastInitiatives",
            content: (
              <InitiativesTable type="past" tableKey="past" initialQuery={initialQuery.past} />
            ),
          },
        ]}
      />
    </>
  );
};

type InitiativesTableProps = {
  type: InitiativeType;
  initialQuery: string;
  tableKey?: string;
};

const InitiativesTable = ({ type, tableKey, initialQuery }: InitiativesTableProps) => {
  const { initiativesToShow, pageDataLoading, initiativesDataTableColumns, pagination, filter } =
    useInitiativeManagement(type, initialQuery);

  return (
    <div className="h-full w-full text-xs text-gray/600">
      <DataTable
        columns={initiativesDataTableColumns}
        isLoading={pageDataLoading}
        data={initiativesToShow ?? []}
        enablePagination
        manualPagination={pagination}
        tableKey={tableKey}
        customHeader={
          <Header
            filter={
              <div className="p-4 pt-0">
                <FilterBar
                  queryFilter={{
                    setFilter: filter.setQuery,
                    filter: filter.query,
                  }}
                  dateFilter={{
                    filter: filter.dateRange,
                    setFilter: filter.setDateRange,
                  }}
                />
              </div>
            }
          />
        }
      />
    </div>
  );
};

InitiativeManagementPage.getLayout = (page) => (
  <Layout titleKey="initiativeManagement">{page}</Layout>
);

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const helpers = await getTrpcHelpers(context);

  const { actualquery, pastquery } = context.query;

  await Promise.all([
    helpers.initiative.getInitiatives.prefetch({
      type: "actual",
      searchQuery: actualquery?.toString(),
      locale: context.locale ?? "es",
    }),
    helpers.initiative.getInitiatives.prefetch({
      type: "past",
      searchQuery: pastquery?.toString(),
      locale: context.locale ?? "es",
    }),
    helpers.initiative.getInitiativesModalData.prefetch(),
  ]);

  return {
    props: {
      trpcState: helpers.dehydrate(),
      messages: await loadMessages(context.locale),
      initialQuery: {
        actual: actualquery?.toString() ?? "",
        past: pastquery?.toString() ?? "",
      },
    },
  };
};

export default InitiativeManagementPage;
