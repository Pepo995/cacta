import { type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Head from "../atoms/Head";

type AuthenticationLayoutProps = {
  children: ReactNode;
  title?: string;
};

const AuthenticationLayout = ({ children, title }: AuthenticationLayoutProps) => {
  const t = useTranslations("auth");

  return (
    <>
      <Head title={title ?? "Cacta"} />
      <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="mx-5 my-6 flex flex-col items-center justify-center gap-6">
          <div className="flex-1 md:max-w-[465px]">{children}</div>

          <div className="w-full">
            <p className="text-sm text-gray/600">{t("copyright")}</p>
          </div>
        </div>

        <div className="m-6 hidden items-center justify-center rounded-3xl bg-authorization-banner bg-cover bg-center md:flex">
          <Image
            src="/icons/logo.svg"
            alt="Cacta"
            width={0}
            height={0}
            sizes="100%"
            className="w-2/5 bg-cover bg-center"
          />
        </div>
      </div>
    </>
  );
};

export default AuthenticationLayout;
