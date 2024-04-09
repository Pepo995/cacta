import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useTranslations } from "next-intl";

import { cn } from "~/utils";
import { ScrollArea, ScrollBar } from "../atoms/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../atoms/Tabs";

type Tab = {
  key: keyof IntlMessages["navigationTab"];
  content: ReactNode;
};

type NavigationTabsProps = {
  tabs: Tab[];
  selectedTab: keyof IntlMessages["navigationTab"];
  setSelectedTab: Dispatch<SetStateAction<keyof IntlMessages["navigationTab"]>>;
  switchTabs?: ReactNode;
  className?: string;
};

const NavigationTabs = ({
  tabs,
  selectedTab,
  setSelectedTab,
  switchTabs,
  className,
}: NavigationTabsProps) => {
  const t = useTranslations();

  return (
    <div className={className}>
      <Tabs defaultValue={selectedTab}>
        <div className="mb-4 flex flex-col justify-between lg:mb-0 lg:flex-row">
          <ScrollArea>
            <TabsList className="mb-4 w-full justify-start gap-x-6 whitespace-nowrap rounded-none border-b-[1px] border-gray/500 p-0 pl-1 pr-20 font-secondary text-gray/500">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={`tab-${tab.key}`}
                  onClick={() => setSelectedTab(tab.key)}
                  variant="secondary"
                  value={tab.key}
                  className={cn(
                    "translate-y-1.5 px-0 text-sm",
                    selectedTab === tab.key &&
                      "border-b-[1px] border-secondary text-secondary",
                  )}
                >
                  {t(`navigationTab.${tab.key}`)}
                </TabsTrigger>
              ))}

              <ScrollBar orientation="horizontal" />
            </TabsList>
          </ScrollArea>

          {switchTabs}
        </div>

        {tabs.map((tab) => (
          <TabsContent key={`tab-${tab.key}`} value={tab.key}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NavigationTabs;
