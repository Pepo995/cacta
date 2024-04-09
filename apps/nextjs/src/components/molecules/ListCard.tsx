import { Arrow } from "@radix-ui/react-tooltip";
import { useTranslations } from "next-intl";

import { round } from "~/utils/mathHelpers";
import { cn } from "~/utils";
import { Card } from "../atoms/Card";
import GradientText from "../atoms/GradientText";
import { ScrollArea, ScrollBar } from "../atoms/ScrollArea";
import Separator from "../atoms/Separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../atoms/Tooltip";

type BaseListCardProps = {
  title: string;
};

type ListCardProps =
  | (BaseListCardProps & {
      data: { name: string; value: number }[];
      showStages: false;
    })
  | (BaseListCardProps & {
      data: {
        name: string;
        totalValue: number;
        core: number;
        upstream: number;
        transportation: number;
      }[];
      showStages: true;
    });

type LegendItemProps = {
  label: string;
  color: string;
};

type StagesBarsProps = {
  label: string;
  value: number;
  color: string;
  isLast?: boolean;
};

const LegendItem = ({ label, color }: LegendItemProps) => (
  <div className="flex gap-1.5">
    <div className="mt-1.5 h-1 w-5 rounded-full" style={{ backgroundColor: color }} />
    <p className="text-[10px] text-gray/600">{label}</p>
  </div>
);

const StagesBars = ({ label, value, color, isLast }: StagesBarsProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn("h-full cursor-pointer", isLast && "rounded-r-full")}
          style={{
            width: `${Math.abs(value)}%`,
            backgroundColor: color,
          }}
        />
      </TooltipTrigger>

      <TooltipContent className="border-none bg-gray/900 text-xs text-white">
        <Arrow />

        <p>
          {label}: {round(value, 1, true)}%
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ListCard = ({ title, data, showStages }: ListCardProps) => {
  const t = useTranslations();

  return (
    <Card className="h-full p-4">
      <GradientText>{title}</GradientText>

      <Separator className="mb-5 mt-3 border-dashed border-gray-300" />

      {!showStages ? (
        <ScrollArea className="h-[calc(100%_-_55px)]">
          <div className="flex flex-col gap-y-4">
            {data.map((item, index) => (
              <div key={index}>
                <div className="mb-2 flex justify-between text-sm">
                  <p className="font-semibold">
                    {index + 1} | {item.name}
                  </p>

                  <p className="text-gray/400">{round(item.value, 1, true)}%</p>
                </div>

                <div className="h-[3px] w-full rounded-full bg-secondary/lighter">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className="h-[240px] lg:h-[calc(100%_-_120px)]">
            <div className="flex flex-col gap-y-4">
              {data.map((item, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between text-sm">
                    <p className="font-semibold">
                      {index + 1} | {item.name}
                    </p>

                    <p className="text-gray/400">{round(item.totalValue, 1, true)}%</p>
                  </div>

                  <div className="relative flex h-1 w-full overflow-hidden rounded-full bg-gray/100">
                    <StagesBars
                      label={t("performancePerKpi.viewStages.step1Title")}
                      value={item.upstream}
                      color="#c684ff"
                    />

                    <StagesBars
                      label={t("performancePerKpi.viewStages.step2Title")}
                      value={item.transportation}
                      color="#8e33ff"
                    />

                    <StagesBars
                      label={t("performancePerKpi.viewStages.step3Title")}
                      value={item.core}
                      color="#5119b7"
                      isLast
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <ScrollArea>
            <div className="mt-4 flex h-12 items-center justify-between gap-3 rounded-md border border-dashed border-gray/300 px-2">
              <LegendItem label={t("performancePerKpi.viewStages.step1Title")} color="#c684ff" />

              <LegendItem label={t("performancePerKpi.viewStages.step2Title")} color="#8e33ff" />

              <LegendItem label={t("performancePerKpi.viewStages.step3Title")} color="#5119b7" />
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </>
      )}
    </Card>
  );
};

export default ListCard;
