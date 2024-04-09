import { useEffect, type Dispatch, type SetStateAction } from "react";
import { type Activity, type Kpi, type Product } from "@cacta/db";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useLocale, useTranslations } from "next-intl";

import { translateField } from "~/utils/getTranslation";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { ScrollBar } from "../atoms/ScrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/SelectInput";
import Separator from "../atoms/Separator";

type BaseFilterBarProps = {
  products: Product[];
  selectedProduct?: string;
  setSelectedProduct: Dispatch<SetStateAction<string | undefined>>;
  kpis: Kpi[];
  activities: Activity[];
  selectedActivities: Activity[];
  setSelectedActivities: Dispatch<SetStateAction<Activity[]>>;
  disableActivityFilter?: boolean;
};

type FilterBarProps =
  | (BaseFilterBarProps & {
      selectedKpiIds: string | undefined;
      setSelectedKpiIds: Dispatch<SetStateAction<string | undefined>>;
      multiselect: false;
    })
  | (BaseFilterBarProps & {
      selectedKpiIds: string[];
      setSelectedKpiIds: Dispatch<SetStateAction<string[]>>;
      multiselect: true;
    });

const FiltersBar = ({
  products,
  selectedProduct,
  setSelectedProduct,
  kpis,
  selectedKpiIds,
  setSelectedKpiIds,
  activities,
  selectedActivities,
  setSelectedActivities,
  disableActivityFilter,
  multiselect,
}: FilterBarProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const onKpiClick = (kpiId: string) => {
    if (!multiselect) {
      setSelectedKpiIds(kpiId);
      return;
    }

    const item = selectedKpiIds.find((selectedKpi) => selectedKpi === kpiId);

    if (item) {
      const index = selectedKpiIds.indexOf(kpiId);

      const updatedSelected = [
        ...selectedKpiIds.slice(0, index),
        ...selectedKpiIds.slice(index + 1),
      ];

      setSelectedKpiIds(updatedSelected);
      return;
    }

    const updatedSelected = [...selectedKpiIds, kpiId];
    setSelectedKpiIds(updatedSelected);
  };

  const onActivityClick = (activity: Activity) => {
    const item = selectedActivities.find(
      (selectedActivity) => selectedActivity === activity,
    );

    if (item) {
      const index = selectedActivities.indexOf(activity);

      const updatedSelected = [
        ...selectedActivities.slice(0, index),
        ...selectedActivities.slice(index + 1),
      ];

      setSelectedActivities(updatedSelected);
      return;
    }

    const updatedSelected = [...selectedActivities, activity];

    if (updatedSelected.length === activities.length)
      return setSelectedActivities([]);

    setSelectedActivities(updatedSelected);
  };

  useEffect(() => {
    if (disableActivityFilter) {
      setSelectedActivities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKpiIds]);

  return (
    <Card className="px-4 py-3">
      <p className="text-sm font-semibold text-gray/700">
        {t("filters.title")}
      </p>

      <div className="flex w-full items-center py-2">
        <Select
          onValueChange={(value) => setSelectedProduct(value)}
          value={selectedProduct}
        >
          <SelectTrigger className="h-7 w-[360px] border-secondary/light font-secondary text-xs font-semibold text-secondary/light">
            <SelectValue
              placeholder={t("performancePerKpi.viewPanel.selectAProduct")}
            />
          </SelectTrigger>

          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {translateField(product.name, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mx-4 h-9 border-r border-dashed border-gray/400" />

        <ScrollArea className="w-full overflow-auto whitespace-nowrap">
          <div className="flex gap-x-4">
            {kpis.map((kpi) => (
              <Button
                key={kpi.id}
                className="h-auto w-full px-1 py-[5px] text-xs"
                variant={
                  (!multiselect && selectedKpiIds === kpi.id) ||
                  (multiselect &&
                    selectedKpiIds?.some(
                      (selectedKpi) => selectedKpi === kpi.id,
                    ))
                    ? "secondary-outline"
                    : "inactive-outline"
                }
                onClick={() => onKpiClick(kpi.id)}
              >
                {translateField(kpi.name, locale)}
              </Button>
            ))}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <Separator className="border-dashed border-gray-300" />

      <ScrollArea className="w-full overflow-auto whitespace-nowrap">
        <div className="flex w-full items-center gap-x-4 pt-3">
          <Button
            key={"ViewAll"}
            className="h-auto w-full px-1 py-[5px] text-xs"
            variant={
              selectedActivities.length === 0
                ? "secondary-outline"
                : "inactive-outline"
            }
            onClick={() => setSelectedActivities([])}
            disabled={disableActivityFilter}
          >
            {t("filters.activity.viewAll")}
          </Button>

          {activities.map((activity) => (
            <Button
              key={activity}
              className="h-auto w-full px-1 py-[5px] text-xs"
              variant={
                selectedActivities?.some(
                  (selectedActivity) => activity === selectedActivity,
                )
                  ? "secondary-outline"
                  : "inactive-outline"
              }
              onClick={() => onActivityClick(activity)}
              disabled={disableActivityFilter}
            >
              {t(`filters.activity.${activity}`)}
            </Button>
          ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};

export default FiltersBar;
