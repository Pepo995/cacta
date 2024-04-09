import React, { useState } from "react";
import { Arrow } from "@radix-ui/react-tooltip";
import { useTranslations } from "next-intl";
import { AiOutlineInfoCircle } from "react-icons/ai";

import { round } from "~/utils/mathHelpers";
import { cn } from "~/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../atoms/Tooltip";
import { InformationModal } from "./InformationModal";

type ItemProps = {
  name: string;
  value: number;
};

type BarChartGHGCardProps = {
  items: ItemProps[];
  showInformation?: boolean;
};

const GHGInformationModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const t = useTranslations();

  return (
    <InformationModal
      triggerButton={
        <i className="cursor-pointer">
          <AiOutlineInfoCircle
            className="hover:scale-[1.1] hover:bg-transparent hover:text-secondary"
            size={20}
          />
        </i>
      }
      open={openModal}
      setOpen={setOpenModal}
      title={t("cards.barChartGHGCard.information.title")}
    >
      <p className="text-justify">{t("cards.barChartGHGCard.information.description")}</p>
      <ul className="list-disc pl-10">
        <li>{t("cards.barChartGHGCard.information.s1")}</li>
        <li>{t("cards.barChartGHGCard.information.s2")}</li>
        <li>{t("cards.barChartGHGCard.information.s3")}</li>
      </ul>
    </InformationModal>
  );
};
const colors = ["rgb(209 213 219)", "rgb(107 114 128)", "rgb(55 65 81)"];

const BarChartGHGCard = ({ items, showInformation = false }: BarChartGHGCardProps) => {
  const t = useTranslations();

  const itemsAbsoluteValue = items.map((item) => ({ ...item, value: Math.abs(item.value) }));
  const findFirstNonZeroItem = itemsAbsoluteValue.find((item) => item.value !== 0)?.name;
  const isLast = itemsAbsoluteValue.filter((item) => item.value !== 0).length === 1;

  const calculatePercentage = (value: number) =>
    (value / itemsAbsoluteValue.reduce((acumulator, item) => acumulator + item.value, 0)) * 100;

  const getBackgroundColor = (index: number) => {
    if (index === itemsAbsoluteValue.length - 1) return ``;
    if (itemsAbsoluteValue[index + 1]?.value === 0) return colors[index + 2];

    return colors[index + 1];
  };

  return (
    <div className="flex w-full flex-col gap-14">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-[15px] font-bold">{t("cards.barChartGHGCard.title")}</p>
          <p className="text-xs">{t("cards.barChartGHGCard.subtitle")}</p>
        </div>

        {showInformation && <GHGInformationModal />}
      </div>

      <div className="flex h-7 w-full items-center rounded-full border-[1px] p-[1px] font-secondary text-xs">
        {itemsAbsoluteValue.map(
          ({ name, value }, index) =>
            value > 0 && (
              <div
                key={`item-${index}`}
                className={cn(
                  "flex h-full w-full min-w-[20px]",
                  (itemsAbsoluteValue[index + 1]?.value === 0 || index === 0) && isLast
                    ? "rounded-full"
                    : "rounded-s-full",
                  itemsAbsoluteValue[0]?.value === 0 &&
                    name === (findFirstNonZeroItem ?? "") &&
                    "rounded-s-full",
                )}
                style={{
                  backgroundColor: getBackgroundColor(index),
                  width: `${calculatePercentage(value)}%`,
                }}
              >
                <div
                  className={cn(
                    "flex h-6 w-full items-center justify-center gap-6 rounded-e-full font-secondary",
                    index === 0 && "rounded-s-full",
                    index >= 1 && "text-white",
                    itemsAbsoluteValue[0]?.value === 0 &&
                      name === (findFirstNonZeroItem ?? "") &&
                      "rounded-full",
                  )}
                  style={{
                    backgroundColor: colors[index],
                  }}
                >
                  <TooltipProvider>
                    <Tooltip open>
                      <TooltipTrigger>
                        <p className="font-semibold">{name}</p>
                      </TooltipTrigger>

                      <TooltipContent
                        sideOffset={10}
                        className={cn("border-none text-xs", index >= 1 && "text-white")}
                        style={{
                          backgroundColor: colors[index],
                        }}
                      >
                        <Arrow />

                        <p className="font-secondary text-xs">
                          {`${round(calculatePercentage(value), 1, true)}%`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default BarChartGHGCard;
