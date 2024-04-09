import React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { type IconType } from "react-icons";

import { cn } from "~/utils";
import { AccordionItem, AccordionTrigger } from "./Accordion";
import AccordionSideBarItem from "./AccordionSideBarItem";

export const sidebarItemVariants = cva(
  "mr-2 flex w-full flex-row items-center justify-between p-3 text-sm text-gray/500 font-secondary",
  {
    variants: {
      selected: {
        true: "bg-secondary/lighter rounded-md text-secondary",
      },
    },
  },
);

export type AccordionValueProps = {
  itemKey: keyof IntlMessages["sidebar"];
  subpath: string;
};

export type SidebarItemProps = {
  title: keyof IntlMessages["sidebar"];
  path: string;
  selected?: boolean;
  accordionValues?: AccordionValueProps[];
  Icon: IconType;
};

const SidebarItem = ({
  title,
  path,
  Icon,
  selected,
  accordionValues,
}: SidebarItemProps) => {
  const t = useTranslations();

  return !accordionValues ? (
    <AccordionItem value={title}>
      <Link href={path}>
        <AccordionTrigger
          isChevronActivated={false}
          className={cn(sidebarItemVariants({ selected }))}
        >
          <Icon size={18} />
          <p>{t(`sidebar.${title}`)}</p>
        </AccordionTrigger>
      </Link>
    </AccordionItem>
  ) : (
    <AccordionSideBarItem
      title={title}
      Icon={Icon}
      path={path}
      accordionValues={accordionValues}
      selected={selected}
    />
  );
};

export default SidebarItem;
