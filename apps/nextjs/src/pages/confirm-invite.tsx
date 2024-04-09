import { useEffect } from "react";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import router from "next/router";
import jwt from "jsonwebtoken";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { api } from "~/utils/api";
import { SIGN_IN } from "~/utils/constants/routes";
import { env } from "~/env.mjs";
import { toast } from "~/hooks/useToast";

type ConfirmInviteProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const TokenSchema = z.object({
  invitationId: z.string(),
});

const ConfirmInvite = ({ decodedToken }: ConfirmInviteProps) => {
  const t = useTranslations();

  const { mutate } = api.invitations.acceptInvite.useMutation({
    async onError() {
      toast({ variant: "destructive", title: t("usersList.acceptInvite.error") });
      await router.push(SIGN_IN);
    },

    async onSuccess() {
      await router.push(SIGN_IN);
    },
  });

  useEffect(() => {
    if (decodedToken) {
      mutate({ invitationId: decodedToken.invitationId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedToken]);
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { token } = context.query;

  if (!token) {
    return { redirect: { destination: SIGN_IN } };
  }

  try {
    const decodedToken = TokenSchema.parse(jwt.verify(token as string, env.JWT_SECRET_KEY));

    return {
      props: {
        decodedToken,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      redirect: {
        destination: SIGN_IN,
      },
    };
  }
};

export default ConfirmInvite;
