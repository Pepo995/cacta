import React, { useState } from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import { type KpiCategory } from "@cacta/db";
import { useLocale } from "next-intl";
import { ImSpinner2 } from "react-icons/im";

import { SIGN_IN } from "~/utils/constants/routes";
import { loadMessages } from "~/utils/nextIntl";
import KPIDetailModal from "~/components/molecules/KPIDetailModal";
import PolarAreaChart from "~/components/organisms/PolarAreaChart";
import Layout from "~/components/templates/Layout";
import usePolarChart from "~/hooks/usePolarChart";
import { getServerAuthSession } from "~/server/auth";
import { type NextPageWithLayout } from "./_app";

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPageWithLayout<HomeProps> = () => {
  const { polarChartData, kpis, logoUrl, isLoading } = usePolarChart();

  // Force polar chart rerender on language change
  const locale = useLocale();
  const key = `polar-chart-${locale}`;

  const [selectedCategory, setSelectedCategory] = useState<KpiCategory>();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh_-_180px)] w-full items-center justify-center">
        <ImSpinner2 size={120} className="animate-spin text-gray/400" />
      </div>
    );
  }

  return (
    <>
      <KPIDetailModal
        kpis={kpis?.filter((kpi) => kpi.category === selectedCategory)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="flex h-[calc(100vh_-_150px)] w-full justify-center">
        <PolarAreaChart
          chartData={polarChartData}
          setSelectedCategory={setSelectedCategory}
          logoUrl={logoUrl}
          key={key}
        />
      </div>
    </>
  );
};

Home.getLayout = (page) => (
  <Layout userName={page.props.userName} titleKey="home">
    {page}
  </Layout>
);

export const getServerSideProps = async ({ locale, req, res }: GetServerSidePropsContext) => {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return { redirect: { destination: SIGN_IN } };
  }

  return {
    props: {
      userName: session.user.firstName,
      messages: await loadMessages(locale),
    },
  };
};

export default Home;
