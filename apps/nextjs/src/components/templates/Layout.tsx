import React, { type ReactElement } from "react";
import { useTranslations } from "next-intl";

import { useAppContext } from "~/hooks/useAppContext";
import { cn } from "~/utils";
import GradientText from "../atoms/GradientText";
import Head from "../atoms/Head";
import Navbar from "../organisms/Navbar";
import Sidebar from "../organisms/Sidebar";

type LayoutProps = {
  children: ReactElement;
  titleKey?: keyof IntlMessages["pageTitles"];
  userName?: string | null;
};

const Layout = ({ children, titleKey, userName }: LayoutProps) => {
  const { showSidebar } = useAppContext();
  const t = useTranslations();

  return (
    <>
      <Head title={titleKey ? t(`sidebar.${titleKey}`) : "Cacta"} />
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <Navbar />

        <div
          className={cn(
            "absolute right-0 mt-[72px] transform transition-all duration-300 ease-in-out",
            showSidebar ? "w-[calc(100%_-_192px)]" : "w-[calc(100%_-_96px)]",
          )}
        >
          <div className="px-6 py-4">
            {titleKey && (
              <GradientText className="font-secondary text-2xl">
                {t(`pageTitles.${titleKey}`)}
                {userName && `, ${userName}!`}
              </GradientText>
            )}

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
