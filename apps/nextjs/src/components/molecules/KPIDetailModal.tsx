import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type KpiCategory } from "@cacta/db";
import { useTranslations } from "next-intl";
import { GrClose } from "react-icons/gr";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import { type Kpi } from "~/hooks/usePolarChart";
import { cn } from "~/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../atoms/Dialog";
import { ScrollArea } from "../atoms/ScrollArea";
import Separator from "../atoms/Separator";

type ModalProps = {
  kpis: Kpi[];
  selectedCategory?: KpiCategory;
  setSelectedCategory: Dispatch<SetStateAction<KpiCategory | undefined>>;
};

type KPIGradientBarProps = {
  targetValue: number;
  currentValue: number;
  products?: { name: string; value: number }[];
};

type TooltipProps = {
  targetValue: number;
  value: number;
  label?: string;
};

const Tooltip = ({ targetValue, value, label }: TooltipProps) => {
  const relativeValue = Math.round(((value ?? 0) * 100) / targetValue);

  const width = label
    ? Math.min(label?.length * 10, 60)
    : Math.max(relativeValue.toLocaleString().length * 9, 40);

  const position = value / targetValue <= 2 ? (value * 50) / targetValue : 100;
  const relativePosition = `calc(${position}% - ${width / 2}px)`;

  return (
    <div className="absolute bottom-11" style={{ left: relativePosition }}>
      <div className="relative">
        <p
          className={cn(
            "line-clamp-1 bg-white p-0.5 text-center text-xs",
            !label && "rounded-sm bg-gray/800 text-white",
          )}
          style={{ width }}
        >
          {label ?? `${relativeValue}%`}
        </p>

        <IoMdArrowDropdown size={16} className="absolute left-[calc(50%_-_8px)] top-[14px]" />
      </div>
    </div>
  );
};

const BenchmarkTooltip = () => {
  const t = useTranslations();

  const width = t("polarChart.benchmark").length * 9;
  const position = `calc(50% - ${width / 2}px)`;

  return (
    <div className="absolute top-11" style={{ left: position }}>
      <div className="relative">
        <IoMdArrowDropup size={16} className="absolute bottom-[18px] left-[calc(50%_-_8px)]" />

        <p
          className="w-fit rounded-sm bg-gray/800 p-1 text-center text-xs text-white"
          style={{ width }}
        >
          {t("polarChart.benchmark")}
        </p>
      </div>
    </div>
  );
};

const KPIGradientBar = ({ targetValue, currentValue, products }: KPIGradientBarProps) => {
  const verticalLines = ["16%", "33%", "50%", "66%", "82%"];

  // Prevent tooltips overlapping
  const referenceValue = 20;

  const filteredProducts = products?.filter(
    (product) =>
      Math.abs((product.value / targetValue) * 100 - (currentValue / targetValue) * 100) >
      referenceValue,
  );

  const finalProducts = filteredProducts?.filter((product, index, array) => {
    if (index === 0) {
      return true;
    }

    const previousValue = array[index - 1]?.value ?? 0;

    return (
      Math.abs((product.value / targetValue) * 100 - (previousValue / targetValue) * 100) >
      referenceValue
    );
  });

  return (
    <div className="relative w-full">
      {finalProducts?.map((product, index) => (
        <Tooltip key={index} targetValue={targetValue} value={product.value} label={product.name} />
      ))}

      <Tooltip targetValue={targetValue} value={currentValue} />

      <BenchmarkTooltip />

      <div className="relative mb-4 mt-16 h-9 w-full rounded-full bg-gradient-green-to-red">
        {verticalLines.map((linePosition, index) => (
          <div
            key={index}
            className="absolute h-full w-0.5 bg-white"
            style={{ right: linePosition }}
          />
        ))}
      </div>
    </div>
  );
};

const KPIDetailModal = ({ selectedCategory, setSelectedCategory, kpis }: ModalProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setOpen(true);
    }
  }, [selectedCategory]);

  const closeModal = () => {
    setOpen(false);
    setSelectedCategory(undefined);
  };

  const onOpenChange = () => {
    setOpen(false);
    setSelectedCategory(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[680px]">
        <DialogHeader className="mb-8 mt-2 px-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-medium text-secondary">
              {selectedCategory && t(`polarChart.categories.${selectedCategory}`)}
            </DialogTitle>

            <GrClose onClick={closeModal} size={16} className="cursor-pointer p-0" />
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea>
          <div className="h-full max-h-[60vh] px-10 py-6">
            <div className="flex flex-col gap-y-10">
              {kpis.map((kpi, index) => (
                <div key={index}>
                  <h2 className="mb-4 font-semibold">{kpi.name}</h2>

                  <p className="mb-8 text-justify">{kpi.description}</p>

                  <KPIGradientBar
                    targetValue={kpi.benchmark}
                    currentValue={kpi.totalValue}
                    products={kpi.products}
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default KPIDetailModal;
