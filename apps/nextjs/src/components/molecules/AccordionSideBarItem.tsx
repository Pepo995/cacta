import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { cn } from "~/utils";
import { Label } from "../atoms/Label";
import { AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";
import { sidebarItemVariants, type SidebarItemProps } from "./SidebarItem";

const AccordionSideBarItem = ({
  title,
  path,
  Icon,
  selected,
  accordionValues,
}: SidebarItemProps) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <AccordionItem value={title} className="w-full">
      <AccordionTrigger className={cn(sidebarItemVariants({ selected }))}>
        <Icon size={18} />
        {t(`sidebar.${title}`)}
      </AccordionTrigger>

      <AccordionContent>
        <div className="flex flex-col gap-y-2">
          {accordionValues?.map(({ itemKey, subpath }, index) => (
            <Link href={`${path}${subpath}`} key={`accordionValue-${index}`}>
              <Label
                className={cn(
                  "ml-3 cursor-pointer border-gray/500 font-secondary text-xs font-semibold text-gray/500 hover:underline",
                  pathname.includes(subpath) && "text-secondary",
                )}
                htmlFor={itemKey}
              >
                {t(`sidebar.${itemKey}`)}
              </Label>
            </Link>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccordionSideBarItem;
