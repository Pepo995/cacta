import React, { useState } from "react";
import { type Kpi } from "@cacta/db";
import { Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AiOutlineCheck, AiOutlineInfoCircle } from "react-icons/ai";

import { api } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { isSelected, normalizeString } from "~/utils/helperFunctions";
import { toast } from "~/hooks/useToast";
import { cn } from "~/utils";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import GradientText from "../atoms/GradientText";
import { ScrollArea } from "../atoms/ScrollArea";
import Separator from "../atoms/Separator";
import { Skeleton } from "../atoms/Skeleton";
import FilterBar from "../organisms/TableFilterBar";
import { InformationModal } from "./InformationModal";

const Shimmer = () => (
  <>
    {Array.from({ length: 5 }).map((_item, index) => (
      <div className="flex h-9 items-center px-3" key={index}>
        <Skeleton className="h-5 w-full" />
      </div>
    ))}
  </>
);

const KpiInformationModal = ({ kpi }: { kpi: Kpi }) => {
  const [openModal, setOpenModal] = useState(false);
  const locale = useLocale();

  return (
    <InformationModal
      triggerButton={
        <i>
          <AiOutlineInfoCircle
            className="hover:scale-[1.1] hover:bg-transparent hover:text-secondary"
            size={20}
          />
        </i>
      }
      open={openModal}
      setOpen={setOpenModal}
      title={translateField(kpi.name, locale)}
    >
      <p className="text-justify">{translateField(kpi.description, locale)}</p>
    </InformationModal>
  );
};

const HomePageKpisSelector = () => {
  const t = useTranslations();
  const locale = useLocale();
  const utils = api.useContext();

  const [filter, setFilter] = useState("");

  const { data: kpis, isLoading: kpisLoading } = api.settings.kpis.useQuery();

  const selectedKpiIds = kpis?.userKpis.map((kpi) => kpi.id) ?? [];

  const filteredKpis = kpis?.kpisByCategory
    .filter((category) =>
      category.kpis.some((kpi) =>
        normalizeString(translateField(kpi.name, locale)).includes(normalizeString(filter)),
      ),
    )
    .map((category) => ({
      categoryKey: category.categoryKey,
      kpis: category.kpis.filter((kpi) =>
        normalizeString(translateField(kpi.name, locale)).includes(normalizeString(filter)),
      ),
    }));

  const { mutate: removeKpi } = api.settings.removeKpi.useMutation({
    async onSuccess() {
      await utils.settings.kpis.invalidate();
      return toast({ title: t("selectHomePageKpis.removeKpiSuccess") });
    },
    onError() {
      return toast({ title: t("selectHomePageKpis.removeKpiError") });
    },
  });

  const { mutate: addKpi } = api.settings.addKpi.useMutation({
    async onSuccess() {
      await utils.settings.kpis.invalidate();
      return toast({ title: t("selectHomePageKpis.addKpiSuccess") });
    },
    onError() {
      return toast({ title: t("selectHomePageKpis.addKpiError") });
    },
  });

  const { mutate: resetKpis } = api.settings.reset.useMutation({
    async onSuccess() {
      await utils.settings.kpis.invalidate();
      return toast({ title: t("selectHomePageKpis.resetKpisSuccess") });
    },
    onError() {
      return toast({ title: t("selectHomePageKpis.resetKpisError") });
    },
  });

  const onRemoveClick = (kpiId: string) => {
    if (selectedKpiIds.length > 1) {
      return removeKpi({ kpiId });
    }

    return toast({
      variant: "destructive",
      title: t("selectHomePageKpis.removeLastKpiError"),
    });
  };

  const onAddClick = (kpiId: string) => {
    if (!isSelected(kpiId, selectedKpiIds)) {
      addKpi({ kpiId });
    }
  };

  return (
    <Card className="flex h-full flex-col gap-3 p-4">
      <div className="w-fit">
        <GradientText className="ml-1">{t("selectHomePageKpis.title")}</GradientText>
      </div>

      <div className="flex h-[calc(100%_-_35px)] flex-col gap-3 text-sm">
        <div className="flex w-full items-center gap-2">
          <div className="flex-1">
            <FilterBar queryFilter={{ filter, setFilter }} />
          </div>

          <Button
            variant="outline"
            className="h-10 gap-1 text-gray/500 hover:border-secondary hover:text-secondary "
            onClick={() => resetKpis()}
          >
            <p className="text-xs font-medium">{t("selectHomePageKpis.clear")}</p>
          </Button>
        </div>

        <ScrollArea className="h-full rounded-md border border-gray_24 py-1">
          <div className="flex flex-col">
            {kpisLoading ? (
              <Shimmer />
            ) : (
              filteredKpis?.map((category, index) => (
                <React.Fragment key={index}>
                  <div className="px-3 py-2">
                    <p className="font-semibold">{t(`kpiCategory.${category.categoryKey}`)}</p>
                  </div>

                  {category.kpis.map((kpi) => (
                    <div
                      key={kpi.id}
                      className={cn(
                        "flex h-9 items-center justify-between px-3 hover:cursor-pointer hover:bg-gray/200",
                        kpi.enabled ? "text-black" : "text-gray/400",
                      )}
                      onClick={() => onAddClick(kpi.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-[18px]">
                          {isSelected(kpi.id, selectedKpiIds) && <AiOutlineCheck size={16} />}
                        </div>

                        <p>{translateField(kpi.name, locale)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected(kpi.id, selectedKpiIds) && (
                          <Button
                            variant="ghost"
                            className={cn(
                              "p-0 transition-all hover:scale-[1.1] hover:bg-transparent hover:text-secondary",
                              kpi.enabled ? "text-black" : "text-gray/400",
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveClick(kpi.id);
                            }}
                          >
                            <Trash size={16} />
                          </Button>
                        )}

                        <KpiInformationModal kpi={kpi} />
                      </div>
                    </div>
                  ))}

                  {index !== filteredKpis.length - 1 && (
                    <Separator className="border-dashed border-gray/300" />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default HomePageKpisSelector;
