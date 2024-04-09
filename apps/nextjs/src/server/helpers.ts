import type { GetServerSidePropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "./api/root";
import { getServerAuthSession } from "./auth";
import { prisma } from "@cacta/db";

export const getTrpcHelpers = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session },
    transformer: SuperJSON,
  });

  return helpers;
};
