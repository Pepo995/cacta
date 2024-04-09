import { useTranslations } from "next-intl";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

import { round } from "~/utils/mathHelpers";
import { cn } from "~/utils";
import { Card } from "../atoms/Card";
import GradientText from "../atoms/GradientText";

type MonitorCardProps = {
  title: string;
  amount: number;
  unit: string;
  variation?: number;
  selected?: boolean;
  isCard?: boolean;
  enableFooter?: boolean;
  className?: string;
};

const MonitorCard = ({
  title,
  amount,
  unit,
  variation,
  isCard = true,
  selected,
  enableFooter = true,
  className,
}: MonitorCardProps) => {
  const t = useTranslations();

  return (
    <Card className={cn("p-4", className, selected && "bg-gray/100", !isCard && "shadow-none")}>
      <div className="flex min-w-[220px] flex-col justify-between gap-1">
        <p className="truncate text-[15px] font-bold">{title}</p>

        <div className="flex w-fit items-center">
          <GradientText
            variant={
              enableFooter && variation ? (variation > 0 ? "error" : "success") : "secondary"
            }
            className="truncate text-[15px]"
          >
            {round(amount)} {unit}
          </GradientText>
        </div>

        {enableFooter && variation && (
          <div className="flex items-center gap-x-2">
            <div className="h-5 w-5">
              {variation > 0 ? (
                <FaArrowTrendUp
                  size={20}
                  className="rounded-full bg-error/lighter p-1 text-error"
                />
              ) : (
                <FaArrowTrendDown
                  size={20}
                  className="rounded-full bg-success/lighter p-1 text-success"
                />
              )}
            </div>

            <div className="flex items-center gap-1">
              <GradientText
                className="text-xs font-semibold"
                variant={variation > 0 ? "error" : "success"}
              >
                {variation > 0 && "+"}
                {round(variation, 1, true)}%
              </GradientText>

              <p className="text-[11px] font-medium text-gray/600">
                {t("cards.monitorCard.vsTarget")}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MonitorCard;
