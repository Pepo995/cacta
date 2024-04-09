import { useState } from "react";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { api } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { cn } from "~/utils";
import { Button } from "../atoms/Button";
import { Skeleton } from "../atoms/Skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../molecules/Accordion";
import { InformationModal } from "../molecules/InformationModal";

type ProductScoreModalProps = {
  productId: string;
  organizationCampaignId: string;
  productName: string;
  startDate: Date;
  endDate: Date | null;
};

const BodyShimmer = () => (
  <div className="flex flex-col gap-8">
    <Skeleton className="h-12 px-3 py-2" />

    <div className="mb-2 flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <Skeleton className="h-8 w-full" />

      <Skeleton className="h-8 w-full" />

      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

const ProductScoreModal = ({
  productId,
  organizationCampaignId,
  productName,
  startDate,
  endDate,
}: ProductScoreModalProps) => {
  const t = useTranslations();

  const [openModal, setOpenModal] = useState(false);

  const { isLoading, data: activityData } = api.report.getActivityInputsByProduct.useQuery(
    {
      productId,
      organizationCampaignId,
    },
    { enabled: openModal },
  );

  const locale = useLocale();

  const formatDate = (date: Date) => format(date, "dd/LL/yy");

  const defaultValue = (activityData ?? [])[0]?.categoryName;

  const isLoadingModalData = isLoading || !activityData;

  return (
    <InformationModal
      loading={isLoadingModalData}
      triggerButton={
        <Button variant="ghost">
          <Eye className="text-slate-500" width={18} />
        </Button>
      }
      withCloseButton
      title={t("report.scoreCard.modal.title", { product: productName })}
      description={t("report.scoreCard.modal.description", {
        startDate: formatDate(startDate),
        endDate: endDate ? formatDate(endDate) : "",
      })}
      open={openModal}
      setOpen={setOpenModal}
    >
      {!isLoadingModalData ? (
        <div className="flex flex-col">
          <div className="mb-8 grid grid-cols-6 bg-gray/100 px-3 py-2 text-center text-xs font-semibold sm:text-sm ">
            <p>{t("report.scoreCard.modal.parameter")}</p>

            <p>{t("report.scoreCard.modal.unit")}</p>

            <p>{t("report.scoreCard.modal.upstream")}</p>

            <p>{t("report.scoreCard.modal.core")}</p>

            <p>{t("report.scoreCard.modal.downstream")}</p>

            <p>{t("report.scoreCard.modal.total")}</p>
          </div>

          <Accordion type="single" collapsible defaultValue={defaultValue}>
            {activityData?.map(({ categoryName, kpis }) => (
              <AccordionItem key={categoryName} value={categoryName} className="w-full">
                <AccordionTrigger className="rounded-md bg-gradient-secondary px-3 py-2 text-xs text-white">
                  <p>{t(`kpiCategory.${categoryName}`)}</p>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="flex flex-col gap-y-2">
                    {kpis.map((kpi, index) => (
                      <div
                        key={`${kpi.unit} - ${index}`}
                        className={cn(
                          "grid grid-cols-6 px-3 py-2 text-center text-xs text-gray/500",
                          index !== kpis.length - 1 && "border-b-[1px] border-dashed",
                        )}
                      >
                        <p>{translateField(kpi.kpiName, locale)}</p>

                        <p>{kpi.unit}</p>

                        <p>{kpi.totals.upstream}</p>

                        <p>{kpi.totals.core}</p>

                        <p>
                          {kpi.totals.downstream === "0"
                            ? t("report.scoreCard.modal.mnd")
                            : kpi.totals.downstream}
                        </p>

                        <p>{kpi.totals.totalValue}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-4 text-xs text-gray/500">*{t("report.scoreCard.modal.mndFooter")}</p>
        </div>
      ) : (
        <BodyShimmer />
      )}
    </InformationModal>
  );
};

export default ProductScoreModal;
