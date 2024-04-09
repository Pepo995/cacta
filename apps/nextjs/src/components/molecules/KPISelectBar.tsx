import { type Dispatch, type SetStateAction } from "react";
import { useLocale } from "next-intl";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { translateField } from "~/utils/getTranslation";
import { type KpiBenchmark } from "~/hooks/useSummaryByProduct";
import { cn } from "~/utils";

type KPISelectBarType = {
  kpis: KpiBenchmark[];
  selectedKpi: KpiBenchmark;
  setSelectedKpi: Dispatch<SetStateAction<KpiBenchmark | undefined>>;
};

const KPISelectBar = ({ kpis, selectedKpi, setSelectedKpi }: KPISelectBarType) => {
  const locale = useLocale();
  const KPIIndex = kpis.indexOf(selectedKpi);

  const isFirst = KPIIndex === 0;
  const isLast = KPIIndex === kpis.length - 1;

  const onNext = () => {
    const nextKpi = kpis[KPIIndex + 1];

    if (!nextKpi) return;

    setSelectedKpi(nextKpi);
  };

  const onBack = () => {
    const previousKpi = kpis[KPIIndex - 1];

    if (!previousKpi) return;

    setSelectedKpi(previousKpi);
  };

  return (
    <div className="mb-2 flex items-center justify-between rounded-sm bg-gray/200 px-6 py-2 font-bold">
      <IoIosArrowBack
        className={cn("hover:cursor-pointer", isFirst && "text-gray/400 hover:cursor-default")}
        onClick={onBack}
      />

      <p className="text-[15px]">{translateField(selectedKpi?.name, locale)}</p>

      <IoIosArrowForward
        className={cn("hover:cursor-pointer", isLast && "text-gray/400 hover:cursor-default")}
        onClick={onNext}
      />
    </div>
  );
};

export default KPISelectBar;
