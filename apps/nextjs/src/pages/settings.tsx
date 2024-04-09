import React from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";

import { SIGN_IN } from "~/utils/constants/routes";
import { loadMessages } from "~/utils/nextIntl";
import HomePageKpisSelector from "~/components/molecules/HomePageKpisSelector";
import UsersList from "~/components/molecules/UsersList";
import ProfileSettings from "~/components/organisms/ProfileSettings";
import Layout from "~/components/templates/Layout";
import { getServerAuthSession } from "~/server/auth";
import { getTrpcHelpers } from "~/server/helpers";
import { type NextPageWithLayout } from "./_app";

type SettingsPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SettingsPage: NextPageWithLayout<SettingsPageProps> = ({ userId }: SettingsPageProps) => (
  <div className="flex flex-col gap-4">
    <ProfileSettings />

    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="h-[300px] w-full lg:h-[calc(100vh_-_435px)] lg:w-[35%] xl:w-[26%]">
        <UsersList userId={userId} />
      </div>

      <div className="h-[500px] w-full lg:h-[calc(100vh_-_435px)] lg:w-[75%] xl:w-[74%]">
        <HomePageKpisSelector />
      </div>
    </div>
  </div>
);

SettingsPage.getLayout = (page) => <Layout titleKey="personalSettings">{page}</Layout>;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { locale, req, res } = context;
  const session = await getServerAuthSession({ req, res });
  const helpers = await getTrpcHelpers(context);

  await helpers.invitations.getUsers.prefetch();
  await helpers.settings.kpis.prefetch();

  if (!session) {
    return { redirect: { destination: SIGN_IN } };
  }

  return {
    props: {
      trpcState: helpers.dehydrate(),
      userId: session.user.id,
      messages: await loadMessages(locale),
    },
  };
};

export default SettingsPage;
