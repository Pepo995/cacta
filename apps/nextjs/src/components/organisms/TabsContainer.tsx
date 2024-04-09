import { type ReactElement } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/atoms/Tabs";
import { ScrollArea } from "../atoms/ScrollArea";

type Tab = {
  name: string;
  content: ReactElement;
};

type TabsContainerProps = {
  title?: string;
  tabs: Tab[];
};

const TabsContainer = ({ title, tabs }: TabsContainerProps) => (
  <>
    <h1 className="mb-2 text-lg font-semibold not-italic leading-7 text-secondary">
      {title}
    </h1>

    <Tabs defaultValue={tabs[0]?.name}>
      <TabsList>
        <ScrollArea>
          {tabs?.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name}>
              {tab.name}
            </TabsTrigger>
          ))}
        </ScrollArea>
      </TabsList>

      {tabs?.map((tab) => (
        <TabsContent className="mt-4" key={tab.name} value={tab.name}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  </>
);

export default TabsContainer;
