import { type Dispatch, type SetStateAction } from "react";
import { useTranslations } from "next-intl";

import { type ModeType, type ViewType } from "~/utils/types";
import { Tabs, TabsList, TabsTrigger } from "../atoms/Tabs";

type TabType = ModeType | ViewType;

type SwitchTabsProps<T extends TabType> = {
  key1: T;
  key2: T;
  setSelected: Dispatch<SetStateAction<T>>;
  defaultValue?: T;
};

const SwitchTabs = <T extends TabType>({
  key1,
  key2,
  setSelected,
  defaultValue,
}: SwitchTabsProps<T>) => {
  const t = useTranslations();

  return (
    <Tabs defaultValue={defaultValue ?? key1}>
      <TabsList className="bg-white">
        {[key1, key2].map((tabKey) => (
          <TabsTrigger
            className="text-xs"
            key={tabKey}
            value={tabKey}
            onClick={() => setSelected(tabKey)}
          >
            {t(`switchTabs.${tabKey}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default SwitchTabs;
