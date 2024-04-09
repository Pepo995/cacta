import { useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loadMessages } from "~/utils/nextIntl";
import { Button } from "~/components/atoms/Button";
import GradientText from "~/components/atoms/GradientText";
import TextInputWithError from "~/components/molecules/TextInputWithError";
import AuthenticationLayout from "~/components/templates/AuthenticationLayout";
import { toast } from "~/hooks/useToast";
import type { NextPageWithLayout } from "./_app";

type SignInProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SignIn: NextPageWithLayout<SignInProps> = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const { reload } = useRouter();

  const signInSchema = z.object({
    email: z.string().min(1, t("errors.required")).email(t("errors.invalid")),
    password: z
      .string()
      .min(1, t("errors.required"))
      .min(8, t("errors.min", { min: "8", name: t("auth.signIn.password") })),
  });

  type SignInFormData = z.infer<typeof signInSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async ({ email, password }: SignInFormData) => {
    setLoading(true);

    const signInResponse = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResponse?.ok !== true) {
      setLoading(false);

      toast({
        variant: "destructive",
        title: t("auth.signIn.errorToast.title"),
        description: t("auth.signIn.errorToast.message"),
      });

      return;
    }

    setLoading(false);
    reload();
  };

  return (
    <div className="flex h-full flex-col justify-center">
      <GradientText className="mb-4 mt-16 text-5xl" weight="extrabold">
        {t("auth.signIn.title")}
      </GradientText>

      <h4 className="mb-10 text-sm font-bold text-gray/600">
        {t("auth.signIn.subtitle")}
      </h4>

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <TextInputWithError
          type="email"
          withLabelText={t("auth.signIn.email")}
          error={errors.email?.message}
          {...register("email")}
        />

        <TextInputWithError
          type="password"
          withLabelText={t("auth.signIn.password")}
          className="mb-8"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          loading={loading}
          variant="secondary-gradient"
          size="lg"
        >
          {t("auth.signIn.submit")}
        </Button>
      </form>
    </div>
  );
};

SignIn.getLayout = (page) => (
  <AuthenticationLayout>{page}</AuthenticationLayout>
);

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    messages: await loadMessages(locale),
  },
});

export default SignIn;
