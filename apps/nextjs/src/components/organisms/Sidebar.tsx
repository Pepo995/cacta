import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { SidebarItems } from "~/utils/constants/SidebarItems";
import SidebarItem from "~/components/molecules/SidebarItem";
import { useAppContext } from "~/hooks/useAppContext";
import { cn } from "~/utils";
import { Accordion } from "../molecules/Accordion";

const Sidebar = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const { showSidebar } = useAppContext();
  const t = useTranslations();

  return (
    <aside
      className={cn(
        "fixed z-10 flex h-full flex-col justify-between bg-highlights transition-all duration-300 ease-in-out",
        showSidebar ? "w-48" : "w-24",
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div
          className={cn(
            "mt-12 flex w-full flex-col gap-y-1 px-2 font-medium transition-all duration-300 ease-in-out",
            showSidebar ? "translate-x-0" : "-translate-x-60",
          )}
        >
          <h1 className="mb-2 ml-3 font-secondary text-xs font-semibold uppercase text-gray/500">
            {t("sidebar.categories")}
          </h1>
          <Accordion type="single" collapsible>
            {SidebarItems.map(
              ({ title, path, Icon, accordionValues }, index) => (
                <SidebarItem
                  title={title}
                  path={path}
                  key={`sidebar-${index}`}
                  selected={
                    path === "/"
                      ? pathname === path
                      : pathname.startsWith(path) && path !== "/"
                  }
                  Icon={Icon}
                  accordionValues={accordionValues}
                />
              ),
            )}
          </Accordion>
        </div>

        <Link href="/" className="mx-4 mb-6 flex items-start justify-center">
          <Image
            src="/icons/logoBlackLetters.svg"
            alt="Cacta"
            height={0}
            width={0}
            sizes="100%"
            className={cn(
              "h-auto transition-all duration-300",
              showSidebar ? "w-[80px]" : "w-[60px]",
            )}
            priority
          />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
