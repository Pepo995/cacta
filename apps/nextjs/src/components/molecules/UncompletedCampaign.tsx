import { useTranslations } from "next-intl";
import { AiFillInfoCircle } from "react-icons/ai";

import { Card } from "../atoms/Card";

const UncompletedCampaign = () => {
  const t = useTranslations();

  return (
    <Card className="flex h-full flex-col items-center justify-center border border-info_16 bg-info_8 p-4 shadow-none">
      <AiFillInfoCircle className="mb-2 text-info" size={24} />

      <p className="whitespace-pre-line text-center text-sm font-semibold text-info/dark">
        {t("uncompletedCampaign.title")}
      </p>
    </Card>
  );
};

export default UncompletedCampaign;
