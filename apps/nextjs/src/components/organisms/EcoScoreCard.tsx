import { type EcoScoreGrade, type Prisma } from "@cacta/db";
import { useLocale, useTranslations } from "next-intl";
import { IoMdArrowDropup } from "react-icons/io";

import { translateField } from "~/utils/getTranslation";
import { cn } from "~/utils";
import { Card } from "../atoms/Card";
import GradientText from "../atoms/GradientText";
import { ScrollArea, ScrollBar } from "../atoms/ScrollArea";
import Separator from "../atoms/Separator";

type EcoScoreCardProps = {
  percentage: number;
  grade: EcoScoreGrade;
  campaign: {
    startDate: string;
    endDate?: string;
  };
  productName?: Prisma.JsonValue;
};

type EcoScoreSectionProps = {
  letter: EcoScoreGrade;
  lowerBound: number | null;
  upperBound: number | null;
  className?: string;
};

const ECOSCORE_PERCENTILES = [
  { letter: "E", lowerBound: null, upperBound: 15 },
  { letter: "D", lowerBound: 15, upperBound: 40 },
  { letter: "C", lowerBound: 40, upperBound: 70 },
  { letter: "B", lowerBound: 70, upperBound: 90 },
  { letter: "A", lowerBound: 90, upperBound: null },
] as const;

const MAP_LETTER_TO_COLOR = {
  A: "bg-success/light",
  B: "bg-success",
  C: "bg-warning",
  D: "bg-error",
  E: "bg-error/dark",
};

const getRange = (lowerBound: number | null, upperBound: number | null) => {
  if (lowerBound === null) {
    if (upperBound === null) {
      throw new Error("Both lower and upper bounds cannot be null");
    }

    return {
      text: `< ${upperBound}%`,
      width: upperBound,
    };
  }

  if (upperBound === null) {
    return {
      text: `> ${lowerBound}%`,
      width: 100 - lowerBound,
    };
  }

  return {
    text: `${lowerBound}% - ${upperBound}%`,
    width: upperBound - lowerBound,
  };
};

const EcoScoreSection = ({ letter, lowerBound, upperBound, className }: EcoScoreSectionProps) => {
  const backgroundColor = MAP_LETTER_TO_COLOR[letter];

  const { text, width } = getRange(lowerBound, upperBound);

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-1 text-white",
        backgroundColor,
        className,
      )}
      style={{ width: `${width}%` }}
    >
      <p className="text-base font-semibold lg:text-lg">{letter}</p>
      <p className="text-xs lg:text-base">{text}</p>
    </div>
  );
};

const EcoScoreGraph = ({ percentage }: { percentage: number }) => (
  <ScrollArea className="w-full max-w-5xl">
    <div className="h-fit w-full pb-9 pt-4 lg:pt-9">
      <div className="relative flex h-16 w-full rounded-md lg:h-20 lg:min-w-[600px]">
        {ECOSCORE_PERCENTILES.map((props, index) => (
          <EcoScoreSection
            key={props.letter}
            {...props}
            className={cn(
              index === 0 && "rounded-l-md",
              index === ECOSCORE_PERCENTILES.length - 1 && "rounded-r-md",
            )}
          />
        ))}

        <EcoScoreTooltip percentage={percentage} />
      </div>
    </div>

    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);

const GradingLetter = ({ letter }: { letter: EcoScoreGrade }) => (
  <div
    className={cn(
      "flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold text-white lg:h-20 lg:w-20 lg:min-w-[80px] lg:text-4xl",
      MAP_LETTER_TO_COLOR[letter],
    )}
  >
    {letter}
  </div>
);

const EcoScoreTooltip = ({ percentage }: { percentage: number }) => {
  const label = `${percentage.toFixed(1)}%`;

  const positionStyles = {
    width: label.length * 10,
    left: `calc(${percentage}% - 25px)`,
  };

  return (
    <>
      <IoMdArrowDropup
        size={25}
        className="absolute bottom-[-16px] text-black"
        style={positionStyles}
      />

      <div className="absolute bottom-[-30px]" style={positionStyles}>
        <p className="rounded-sm bg-black p-1 text-center text-xs text-white">{label}</p>
      </div>
    </>
  );
};

const EcoScoreCard = ({ percentage, grade, campaign, productName }: EcoScoreCardProps) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Card className="h-full p-4">
      <div className="pb-2">
        <GradientText>
          {t("report.ecoScore.resultsTitle", {
            productName: productName ? `- ${translateField(productName, locale)}` : undefined,
          })}
        </GradientText>

        <p className="text-xs font-light text-gray/600">
          {t("report.ecoScore.campaignPeriod", { ...campaign })}
        </p>

        <Separator className="mt-3 border-dashed border-gray/300" />
      </div>

      <div className="mt-4 flex h-[calc(100%_-_60px)] w-full flex-col items-center justify-center px-10 lg:mt-0 lg:flex-row lg:gap-20">
        <GradingLetter letter={grade} />
        <EcoScoreGraph percentage={percentage} />
      </div>
    </Card>
  );
};

export default EcoScoreCard;
