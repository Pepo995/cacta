import React from "react";
import { type EcoScoreGrade, type KpiCategory, type Prisma } from "@cacta/db";
import { useLocale, useTranslations } from "next-intl";

import { translateField } from "~/utils/getTranslation";
import { round } from "~/utils/mathHelpers";
import { cn } from "~/utils";
import GradientText from "../atoms/GradientText";
import { ScrollArea } from "../atoms/ScrollArea";
import Separator from "../atoms/Separator";

const MAP_LETTER_TO_COLOR = {
  A: "text-success/light",
  B: "text-success",
  C: "text-warning",
  D: "text-error",
  E: "text-error/dark",
};

type TableDataType = {
  categoryKey: KpiCategory;
  kpiResults: {
    kpiId: string;
    kpiName: Prisma.JsonValue;
    ecoScoreValue: number;
    ecoScoreGrade: EcoScoreGrade;
    previousCampaignGrade?: EcoScoreGrade;
  }[];
}[];

type EcoScoreTableProps = {
  tableData: TableDataType;
};

const EcoScoreTable = ({ tableData }: EcoScoreTableProps) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="h-full">
      <GradientText>{t("report.ecoScore.resultsSummary")}</GradientText>

      <Separator className="mb-5 mt-3 border-dashed border-gray/300" />

      <div className="mb-2 grid w-full grid-cols-5 place-items-center bg-gray/100 p-2 text-sm font-semibold">
        <p>{t("report.ecoScore.table.area")}</p>
        <p>{t("report.ecoScore.table.indicator")}</p>
        <p>{t("report.ecoScore.table.result")}</p>
        <p>{t("report.ecoScore.table.score")}</p>
        <p>{t("report.ecoScore.table.previousCampaign")}</p>
      </div>

      <ScrollArea className="h-[calc(100%_-_100px)]">
        {tableData.map((category) => (
          <React.Fragment key={category.categoryKey}>
            <div className="grid w-full grid-cols-5 place-items-center p-2 text-center text-sm text-gray/500">
              <p
                style={{
                  gridRowStart: 1,
                  gridRowEnd: category.kpiResults.length + 1,
                }}
              >
                {t(`kpiCategory.${category.categoryKey}`)}
              </p>

              {category.kpiResults.map((kpi) => (
                <React.Fragment key={kpi.kpiId}>
                  <p>{translateField(kpi.kpiName, locale)}</p>

                  <p className={cn("font-medium", MAP_LETTER_TO_COLOR[kpi.ecoScoreGrade])}>
                    {`${round(kpi.ecoScoreValue, 1, true)}%`}
                  </p>

                  <p className={cn("font-medium", MAP_LETTER_TO_COLOR[kpi.ecoScoreGrade])}>
                    {kpi.ecoScoreGrade}
                  </p>

                  <p>{kpi.previousCampaignGrade ?? "-"}</p>
                </React.Fragment>
              ))}
            </div>

            <Separator className="my-1 border-dashed border-gray/300" />
          </React.Fragment>
        ))}
      </ScrollArea>
    </div>
  );
};

export default EcoScoreTable;
