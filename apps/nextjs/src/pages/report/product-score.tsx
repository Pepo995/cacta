import React from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import { useTranslations } from "next-intl";

import { loadMessages } from "~/utils/nextIntl";
import Header from "~/components/molecules/TablesCustomHeader";
import { DataTable } from "~/components/organisms/DataTable";
import FilterBar from "~/components/organisms/TableFilterBar";
import Layout from "~/components/templates/Layout";
import useProductScore from "~/hooks/useProductScore";
import { getTrpcHelpers } from "~/server/helpers";
import { type NextPageWithLayout } from "../_app";

type ProductScorePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ProductScorePage: NextPageWithLayout<ProductScorePageProps> = ({ initialQuery }) => (
  <>
    <ProductScoreTable tableKey="productScore" initialQuery={initialQuery} />
  </>
);

type ProductScoreTableProps = {
  initialQuery: string;
  tableKey?: string;
};

const ProductScoreTable = ({ tableKey, initialQuery }: ProductScoreTableProps) => {
  const { productCampaignsToShow, pageDataLoading, productScoreTableColumns, pagination, filter } =
    useProductScore(initialQuery);

  const t = useTranslations();

  return (
    <div className="mt-7 h-full w-full text-xs text-gray/600">
      <DataTable
        columns={productScoreTableColumns}
        isLoading={pageDataLoading}
        data={productCampaignsToShow ?? []}
        enablePagination
        manualPagination={pagination}
        tableKey={tableKey}
        customHeader={
          <Header
            filter={
              <div className="p-4 pt-0">
                <FilterBar
                  searchPlaceholder={t("report.scoreCard.searchPlaceholder")}
                  queryFilter={{
                    setFilter: filter.setQuery,
                    filter: filter.query,
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

ProductScorePage.getLayout = (page) => <Layout titleKey="productScore">{page}</Layout>;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const helpers = await getTrpcHelpers(context);

  const { query } = context.query;

  await helpers.report.getProductScore.prefetch({
    searchQuery: query?.toString(),
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      messages: await loadMessages(context.locale),
      initialQuery: query?.toString() ?? "",
    },
  };
};

export default ProductScorePage;
