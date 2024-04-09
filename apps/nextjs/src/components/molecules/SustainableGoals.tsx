import Image from "next/image";
import { type KpiCategory } from "@cacta/db";
import { useTranslations } from "next-intl";

import { cn } from "~/utils";
import { Card } from "../atoms/Card";

type SustainableGoalsProps = {
  category: KpiCategory;
};

const SustainableGoals = ({ category }: SustainableGoalsProps) => {
  const t = useTranslations();

  const imageSrc = {
    ClimateChange: "/images/sustainable-goals/climate-change.png",
    EcosystemQuality: "/images/sustainable-goals/ecosystem-quality.png",
    HumanHealth: "/images/sustainable-goals/human-health.png",
    ResourcesExhaustion: "/images/sustainable-goals/resources-exhaustion.png",
  };

  const textColor = {
    ClimateChange: "text-[#118D57]",
    EcosystemQuality: "text-[#006C9C]",
    HumanHealth: "text-[#00A76F]",
    ResourcesExhaustion: "text-[#B76E00]",
  };

  const link = {
    ClimateChange:
      "https://www.un.org/sustainabledevelopment/es/climate-change-2/",
    EcosystemQuality: "https://www.un.org/sustainabledevelopment/es/oceans/",
    HumanHealth: "https://www.un.org/sustainabledevelopment/es/health/",
    ResourcesExhaustion:
      "https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/",
  };

  return (
    <Card className="flex w-auto gap-2 bg-gray/100 p-2 shadow-none">
      <div className="w-10">
        <Image
          alt={category}
          src={imageSrc[category]}
          height={50}
          width={50}
          className="rounded-[2px]"
        />
      </div>

      <div className="w-fit">
        <h3
          className={cn(
            "mb-[1px] text-[11px] font-semibold leading-3 2xl:text-xs",
            textColor[category],
          )}
        >
          {t(`sustainableGoals.title.${category}`)}
        </h3>

        <p className="text-[10px] leading-[14px] text-gray/600 2xl:text-xs">
          {t(`sustainableGoals.description.${category}`)}

          <a href={link[category]} target="_blank" className="ml-1 underline">
            {t("text.seeMore")}
          </a>
        </p>
      </div>
    </Card>
  );
};

export default SustainableGoals;
