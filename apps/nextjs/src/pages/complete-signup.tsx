import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";

import { api } from "~/utils/api";
import { SIGN_IN } from "~/utils/constants/routes";
import { loadMessages } from "~/utils/nextIntl";
import { Button } from "~/components/atoms/Button";
import GradientText from "~/components/atoms/GradientText";
import TextInputWithError from "~/components/molecules/TextInputWithError";
import AuthenticationLayout from "~/components/templates/AuthenticationLayout";
import { toast } from "~/hooks/useToast";
import type { NextPageWithLayout } from "./_app";

type CompleteSignupProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const CompleteSignup: NextPageWithLayout<CompleteSignupProps> = () => {
  const t = useTranslations();

  const completeSignUpSchema = z
    .object({
      password: z
        .string()
        .min(1, t("errors.required"))
        .min(
          8,
          t("errors.min", {
            min: "8",
            name: t("auth.confirmAccount.password"),
          }),
        ),
      confirmPassword: z
        .string()
        .min(1, t("errors.required"))
        .min(
          8,
          t("errors.min", {
            min: "8",
            name: t("auth.confirmAccount.confirmPassword"),
          }),
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.passwordMatchError"),
      path: ["confirmPassword"],
    })
    .refine(
      (data) =>
        RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/).test(data.password),
      {
        message: t("auth.confirmAccount.passwordFormatError"),
        path: ["password"],
      },
    );

  type CompleteSignUpData = z.infer<typeof completeSignUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteSignUpData>({
    resolver: zodResolver(completeSignUpSchema),
  });

  const router = useRouter();
  const { update: updateSession } = useSession();

  const { mutate, isLoading } = api.auth.confirmAccount.useMutation({
    onError: () => {
      toast({
        variant: "destructive",
        title: t("auth.confirmAccount.error"),
      });
    },
    onSuccess: async () => {
      await updateSession();
      toast({
        title: t("auth.confirmAccount.success"),
      });
      await router.replace(SIGN_IN);
    },
  });

  const onSubmit = (data: CompleteSignUpData) => {
    mutate({ newPassword: data.password });
  };

  return (
    <div className="flex h-full flex-col justify-center">
      <GradientText className="mb-4 text-5xl" weight="extrabold">
        {t("auth.confirmAccount.title")}
      </GradientText>

      <h4 className="mb-10 text-justify text-sm font-bold text-gray/600">
        {t("auth.confirmAccount.subtitle")}
      </h4>

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <TextInputWithError
          type="password"
          withLabelText={t("auth.confirmAccount.password")}
          error={errors.password?.message}
          {...register("password")}
        />

        <TextInputWithError
          type="password"
          withLabelText={t("auth.confirmAccount.confirmPassword")}
          className="mb-8"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          loading={isLoading}
          variant="secondary-gradient"
          size="lg"
        >
          {t("auth.confirmAccount.submit")}
        </Button>
      </form>
    </div>
  );
};

CompleteSignup.getLayout = (page) => (
  <AuthenticationLayout>{page}</AuthenticationLayout>
);

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    messages: await loadMessages(locale),
  },
});

export default CompleteSignup;
