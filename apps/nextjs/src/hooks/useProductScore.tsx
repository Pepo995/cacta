import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import saveAs from "file-saver";
import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { api, type RouterOutputs } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { Button } from "~/components/atoms/Button";
import ScorecardDocument from "~/components/molecules/ScorecardDocument";
import ProductScoreModal from "~/components/organisms/ProductScoreModal";
import useDebounce from "./useDebounce";
import { usePersistFilters } from "./usePersistFilters";
import { toast } from "./useToast";

type ProductCampaign = RouterOutputs["report"]["getProductScore"]["productCampaigns"][number];

export type ProductCampaignToShow = Omit<ProductCampaign, "product" | "campaign"> & {
  productId: string;
  product: string;
  productInSpanish: string;
  functionalUnit: string;
  campaign: string | undefined;
  productCpcId: string;
  productCpcName: string;
};

export type ActivityInput = RouterOutputs["download"]["downloadScorecardPdf"];

const useProductScore = (initialQuery: string) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState(initialQuery);

  const t = useTranslations();

  const locale = useLocale();

  const debouncedQuery = useDebounce(query, 500);

  usePersistFilters([{ name: "query", value: debouncedQuery }]);

  const { isLoading: pageDataLoading, data } = api.report.getProductScore.useQuery(
    {
      pageIndex,
      pageSize,
      searchQuery: debouncedQuery,
      locale,
    },
    { refetchOnWindowFocus: false },
  );

  const downloadPdf = async (document: JSX.Element) => {
    const pdfDocument = pdf(document);

    pdfDocument.updateContainer(document);

    const blob = await pdfDocument.toBlob();

    saveAs(blob, "tarjeta-ambiental.pdf");
  };

  const { mutateAsync: activityInput } = api.download.downloadScorecardPdf.useMutation({
    async onSuccess(data) {
      const document = (
        <ScorecardDocument productCampaignsToShow={selectedProductCampaigns} activityData={data} />
      );
      await downloadPdf(document);
    },
    onError() {
      return toast({ title: t("errors.downloadPdfError") });
    },
  });

  const [selectedProductCampaigns, setSelectedProductCampaigns] = useState<
    ProductCampaignToShow | undefined
  >(undefined);

  const handlePdfDownload = async (
    productId: string,
    organizationCampaignId: string,
    productCampaign: ProductCampaignToShow,
  ) => {
    setSelectedProductCampaigns(productCampaign);
    await activityInput({
      productId,
      organizationCampaignId,
    });
  };

  const productCampaignsToShow: ProductCampaignToShow[] =
    data?.productCampaigns.map((productCampaign) => ({
      ...productCampaign,
      productCpcId: productCampaign.product.cpcId,
      productCpcName: productCampaign.product.cpcName,
      productId: productCampaign.product.id,
      product: translateField(productCampaign.product.name, locale),
      productInSpanish: translateField(productCampaign.product.name, "es"),
      functionalUnit: "1.00 kg",
      campaign:
        productCampaign.endDate !== null
          ? `${format(productCampaign.startDate, "LLLL.yy", {
              locale: locale === "es" ? es : enUS,
            })} - ${format(productCampaign.endDate, "LLLL.yy", {
              locale: locale === "es" ? es : enUS,
            })}`
          : undefined,
    })) ?? [];

  const productScoreTableColumns: ColumnDef<(typeof productCampaignsToShow)[number]>[] = [
    {
      accessorKey: "product",
      header: () => <p className="text-center">{t("report.scoreCard.tableTitles.product")}</p>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <p>{row.original.product}</p>
        </div>
      ),
    },
    {
      accessorKey: "campaign",
      header: () => <p className="text-center">{t("report.scoreCard.tableTitles.campaign")}</p>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <p>{row.original.campaign}</p>
        </div>
      ),
    },
    {
      accessorKey: "functionalUnit",
      header: () => (
        <p className="text-center">{t("report.scoreCard.tableTitles.functionalUnit")}</p>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <p>{row.original.functionalUnit}</p>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      header: () => <p className="text-center">{t("report.scoreCard.tableTitles.actions")}</p>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <ProductScoreModal
              startDate={row.original.startDate}
              productName={row.original.product}
              endDate={row.original.endDate}
              organizationCampaignId={row.original.organizationCampaignId}
              productId={row.original.productId}
            />

            <Button
              variant="ghost"
              onClick={async () =>
                await handlePdfDownload(
                  row.original.productId,
                  row.original.organizationCampaignId,
                  row.original,
                )
              }
            >
              <Download className="text-slate-500" width={18} />
            </Button>
          </div>
        );
      },
    },
  ];

  return {
    productCampaignsToShow,
    pageDataLoading,
    productScoreTableColumns,
    pagination: {
      pageIndex,
      pageSize,
      setPageIndex,
      setPageSize,
      total: data?.total ?? 0,
    },
    filter: {
      query,
      setQuery,
    },
  };
};

export default useProductScore;
