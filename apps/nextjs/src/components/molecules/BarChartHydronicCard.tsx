import React from "react";
import { useTranslations } from "next-intl";
import { IoMdArrowDropdown } from "react-icons/io";

import { round } from "~/utils/mathHelpers";
import { cn } from "~/utils";

type ItemProps = {
  name: string;
  value: number;
};

type BarChartHydronicCardProps = {
  items: ItemProps[];
};

type TooltipProps = {
  label: string;
  index: number;
  percentage: number;
};

const Tooltip = ({ label, index, percentage }: TooltipProps) => {
  const width = Math.min(label.length * 5, 100);

  const position =
    percentage < 20 ? (index === 0 ? { left: -10 } : { right: -10 }) : { left: -width / 2 + 10 };

  return (
    <>
      <IoMdArrowDropdown
        size={16}
        className={cn(
          "absolute bottom-5 text-gray/800",
          index === 0 ? "text-gray-700" : "text-gray-300",
        )}
      />

      <div
        className="absolute bottom-[30px]"
        style={{
          ...position,
        }}
      >
        <p
          className={cn(
            "rounded-sm p-1 text-center text-[11px]",
            index === 0 ? "bg-gray-700 text-white" : "order-2 bg-gray-300",
          )}
          style={{ width }}
        >
          {label}
        </p>
      </div>
    </>
  );
};

const BarChartHydronicCard = ({ items }: BarChartHydronicCardProps) => {
  const t = useTranslations();

  const calculatePercentage = (value: number) =>
    (value / items.reduce((acumulator, item) => acumulator + item.value, 0)) * 100;

  return (
    <div className="flex w-full flex-col">
      <p className="mb-14 text-[15px] font-bold ">{t("cards.barChartHydronicCard.title")}</p>

      <div className="flex h-7 w-full items-center rounded-full border-[1px] p-[1px] font-secondary text-xs">
        <div className="flex h-full w-full items-center rounded-full bg-gray-300">
          {items.map(
            ({ name, value }, index) =>
              value > 0 && (
                <div
                  key={index}
                  className={cn(
                    "flex h-6 items-center justify-center gap-6 rounded-full font-secondary",
                    index === 0 ? "bg-gray-700 text-white" : "order-2 bg-gray-300",
                  )}
                  style={{ width: `${Math.max(calculatePercentage(value), 15)}%` }}
                >
                  <div className="relative">
                    <Tooltip
                      label={`${name}: ${round(value)} m³/ton`}
                      index={index}
                      percentage={calculatePercentage(value)}
                    />

                    <p
                      className={cn(index === 0 ? "bg-gray-700 text-white" : "order-2 bg-gray-300")}
                    >
                      {round(calculatePercentage(value), 1, true)}%
                    </p>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default BarChartHydronicCard;
