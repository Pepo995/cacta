import { useTranslations } from "next-intl";

import { round } from "~/utils/mathHelpers";
import { Card } from "../atoms/Card";
import GradientText from "../atoms/GradientText";
import { ScrollArea, ScrollBar } from "../atoms/ScrollArea";

type MetricsCardProps = {
  area?: number;
  crops: { cropName: string; cropArea: number }[];
  latitude?: string;
  longitude?: string;
  soilType?: string;
  ph?: number;
  organicMaterial?: number;
  nitrogen?: number;
  phosphorus?: number;
};

const MetricsCard = ({
  area,
  crops,
  latitude,
  longitude,
  soilType,
  ph,
  organicMaterial,
  nitrogen,
  phosphorus,
}: MetricsCardProps) => {
  const t = useTranslations();

  return (
    <Card className="flex flex-col justify-between gap-10 p-4 font-secondary lg:flex-row">
      <div className="min-w-[200px] lg:w-1/2 lg:max-w-[400px]">
        <GradientText className="mb-4 text-lg">
          {t("cards.metricsCard.landMetrics")}
        </GradientText>

        <div className="w-full text-sm 2xl:text-base">
          <div className="mb-1 flex border-b border-muted font-bold">
            <p className="w-1/2">{t("cards.metricsCard.parameter")}</p>
            <p className="w-1/2">{t("cards.metricsCard.value")}</p>
          </div>

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.totalArea")}</p>

            <p className="w-1/2 whitespace-nowrap">
              <ScrollArea>
                {area ? `${round(area)} ha` : "-"}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </p>
          </div>

          {crops
            .sort((a, b) => b.cropArea - a.cropArea)
            .slice(0, 3)
            .map((crop) => (
              <div
                key={crop.cropName}
                className="flex pt-2 text-sm text-gray/600"
              >
                <p className="w-1/2">
                  <li>{crop.cropName}</li>
                </p>

                <p className="w-1/2 whitespace-nowrap">
                  <ScrollArea>
                    {round(crop.cropArea)} ha
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </p>
              </div>
            ))}

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.latitude")}</p>

            <p className="w-1/2 whitespace-nowrap">
              <ScrollArea>
                {latitude ?? "-"}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </p>
          </div>

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.longitude")}</p>

            <p className="w-1/2 whitespace-nowrap">
              <ScrollArea>
                {longitude ?? "-"}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-[200px] lg:w-1/2 lg:max-w-[400px]">
        <GradientText className="mb-4 text-lg">
          {t("cards.metricsCard.environmentalMetrics")}
        </GradientText>

        <div className="w-full text-sm 2xl:text-base">
          <div className="mb-1 flex border-b border-muted font-bold">
            <p className="w-1/2">{t("cards.metricsCard.parameter")}</p>
            <p className="w-1/2">{t("cards.metricsCard.value")}</p>
          </div>

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.soilType")}</p>

            <p className="w-1/2 whitespace-nowrap">
              <ScrollArea>
                {soilType ?? "-"}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </p>
          </div>

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.soilPh")}</p>

            <p className="w-1/2">
              <ScrollArea>{ph ? round(ph) : "-"}</ScrollArea>
            </p>
          </div>

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.organicMaterial")}</p>

            <p className="w-1/2">
              <ScrollArea>
                {organicMaterial ? `${round(organicMaterial)} %` : "-"}
              </ScrollArea>
            </p>
          </div>

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.nitrogen")}</p>

            <p className="w-1/2">
              <ScrollArea>{nitrogen ? `${round(nitrogen)} ppm` : "-"}</ScrollArea>
            </p>
          </div>

          <div className="flex pt-2">
            <p className="w-1/2">{t("cards.metricsCard.phosphorus")}</p>

            <p className="w-1/2">
              <ScrollArea>
                {phosphorus ? `${round(phosphorus)} ppm` : "-"}
              </ScrollArea>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;
