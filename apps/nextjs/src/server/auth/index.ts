import { type GetServerSidePropsContext } from "next";
import { prisma, type User } from "@cacta/db";
import { getServerSession, type NextAuthOptions } from "next-auth";

import { SIGN_IN } from "~/utils/constants/routes";
import { env } from "~/env.mjs";
import CredentialsProvider from "./CredentialsProvider";

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider],
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      const currentUser = user as User;

      if (currentUser) {
        return {
          ...token,
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          pendingVerification: currentUser.pendingVerification,
          profilePictureUrl: currentUser.profilePictureUrl,
        };
      }

      //TODO: This could potientally be a bottleneck
      const databaseUser = await prisma.user.findUnique({
        where: { id: token.id },
      });

      if (!databaseUser) {
        return token;
      }

      return {
        ...token,
        firstName: databaseUser.firstName,
        lastName: databaseUser.lastName,
        pendingVerification: databaseUser.pendingVerification,
        profilePictureUrl: databaseUser.profilePictureUrl,
      };
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
  pages: {
    signIn: SIGN_IN,
    error: SIGN_IN,
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
