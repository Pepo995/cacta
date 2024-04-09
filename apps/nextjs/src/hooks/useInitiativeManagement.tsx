import { useState } from "react";
import { type KpiKey, type Reference } from "@cacta/db";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

import { api, type RouterOutputs } from "~/utils/api";
import { translateField } from "~/utils/getTranslation";
import { intensityKPI } from "~/utils/helperFunctions";
import type { InitiativeType } from "~/utils/types";
import { Button } from "~/components/atoms/Button";
import DeleteInitiativeModal from "~/components/organisms/DeleteInitiativeModal";
import InitiativeModal from "~/components/organisms/InitiativeModal";
import useDebounce from "./useDebounce";
import { usePersistFilters } from "./usePersistFilters";

type Initiative = RouterOutputs["initiative"]["getInitiatives"]["initiatives"][number];

type SortableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  setSorting: (sorting: { sortBy: string; sortOrder: "asc" | "desc" }) => void;
};

const SortableColumnHeader = <TData, TValue>({
  column,
  setSorting,
}: SortableColumnHeaderProps<TData, TValue>) => {
  const t = useTranslations();

  return (
    <div
      className="flex cursor-pointer flex-row items-center"
      onClick={() => {
        setSorting({
          sortBy: column.id,
          sortOrder: column.getIsSorted() === "asc" ? "desc" : "asc",
        });
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
    >
      {t(
        `analyze.initiativeManagement.tableTitles.${
          column.id as keyof IntlMessages["analyze"]["initiativeManagement"]["tableTitles"]
        }`,
      )}

      {column.getIsSorted() === "desc" ? (
        <FaSortDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <FaSortUp className="ml-2 h-4 w-4" />
      ) : (
        <FaSort className="ml-2 h-4 w-4" />
      )}
    </div>
  );
};

const useInitiativeManagement = (type: InitiativeType, initialQuery: string) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sorting, setSorting] = useState<{ sortBy: string; sortOrder: "asc" | "desc" }>({
    sortBy: "startDate",
    sortOrder: "desc",
  });
  const [query, setQuery] = useState(initialQuery);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const debouncedQuery = useDebounce(query, 500);

  const locale = useLocale();

  usePersistFilters([{ name: `${type}query`, value: debouncedQuery }]);

  const { data: modalData } = api.initiative.getInitiativesModalData.useQuery();

  const { isLoading: pageDataLoading, data } = api.initiative.getInitiatives.useQuery({
    type,
    pageIndex,
    pageSize,
    sorting,
    searchQuery: debouncedQuery,
    locale,
    dateRange,
  });

  const t = useTranslations();

  const performanceValue = (
    performance: string | number | null,
    reference: Reference,
    unit: string,
    kpiKey: KpiKey,
  ) => {
    if (performance)
      return `${performance} ${
        reference === "Custom" ? `${unit}${intensityKPI(kpiKey) ? `` : ` / ton`}` : `%`
      }`;

    return t("analyze.initiativeManagement.ongoingCampaign");
  };

  const mapInitiative = (initiative: Initiative) => ({
    ...initiative,
    reference: t(`reference.${initiative.reference}`),
    kpi: translateField(initiative.kpi.name, locale),
    product: translateField(initiative.product, locale),
    objective:
      initiative.reference === "Custom"
        ? `${initiative.objectiveToShow}${initiative.unit}${
            intensityKPI(initiative.kpi.key) ? `` : ` / ton`
          }`
        : `-${initiative.objectiveToShow} %`,
    performanceToShow: performanceValue(
      initiative.performanceToShow,
      initiative.reference,
      initiative.unit,
      initiative.kpi.key,
    ),
    performanceValue: initiative.performanceToShow,
    startDate: format(initiative.startDate, "dd/LL/yyyy"),
    endDate: format(initiative.endDate, "dd/LL/yyyy"),
  });

  const initiativesToShow = data?.initiatives.map(mapInitiative);

  const defaultValues = (id: string) => {
    const initiativeFound = data?.initiatives.find((initiative) => initiative.id === id);

    if (initiativeFound) {
      const {
        description,
        endDate,
        kpiId,
        id,
        name,
        startDate,
        responsibleId,
        objective,
        productId,
        reference,
      } = initiativeFound;

      const defaultValues = {
        id,
        name,
        kpiId,
        productId,
        description: description ?? undefined,
        "dates.startDate": startDate,
        "dates.endDate": endDate,
        responsibleId,
        "objectiveForm.objective": objective.toString(),
        "objectiveForm.reference": reference,
      };

      return defaultValues;
    }

    return undefined;
  };

  const initiativesDataTableColumns: ColumnDef<ReturnType<typeof mapInitiative>>[] = [
    {
      enableSorting: true,
      accessorKey: "name",
      header: ({ column }) => <SortableColumnHeader column={column} setSorting={setSorting} />,
    },
    {
      accessorKey: "kpi",
      header: () => <div>{t("analyze.initiativeManagement.tableTitles.kpi")}</div>,
    },
    {
      enableSorting: true,
      accessorKey: "product",
      header: ({ column }) => <SortableColumnHeader column={column} setSorting={setSorting} />,
    },
    {
      enableSorting: true,
      accessorKey: "startDate",
      header: ({ column }) => <SortableColumnHeader column={column} setSorting={setSorting} />,
    },
    {
      enableSorting: true,
      accessorKey: "endDate",
      header: ({ column }) => <SortableColumnHeader column={column} setSorting={setSorting} />,
    },
    {
      enableSorting: true,
      accessorKey: "responsible",
      header: ({ column }) => <SortableColumnHeader column={column} setSorting={setSorting} />,
    },
    {
      enableSorting: true,
      accessorKey: "reference",
      header: ({ column }) => <SortableColumnHeader column={column} setSorting={setSorting} />,
    },
    {
      accessorKey: "objective",
      header: ({ column }) => <SortableColumnHeader column={column} setSorting={setSorting} />,
    },
    {
      accessorKey: "performance",
      header: () => <p>{t("analyze.initiativeManagement.tableTitles.performance")}</p>,
      cell: ({ row }) => {
        if (row.original.performanceValue) {
          const performance = row.original.performanceToShow.split(" ");
          let performancePercentage: number | null = null;

          const objective = row.original.objective.split(" ");
          let objectivePercentage: number | null = null;

          if (performance && performance[0] && objective && objective[0]) {
            performancePercentage = parseFloat(performance[0]);
            objectivePercentage = parseFloat(objective[0]);
          }

          return (
            <p
              className={
                (performancePercentage ?? 0) <= (objectivePercentage ?? 0)
                  ? "text-green-400"
                  : "text-red-500"
              }
            >
              {row.original.performanceToShow}
            </p>
          );
        }

        return <p>{row.original.performanceToShow}</p>;
      },
    },
    {
      accessorKey: "actions",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      header: () => <p>{t("analyze.initiativeManagement.tableTitles.actions")}</p>,
      cell: ({ row }) => {
        return (
          <div className="flex">
            <InitiativeModal
              modalData={modalData}
              triggerButton={
                <Button variant="ghost">
                  <Edit className="text-slate-500" width={18} />
                </Button>
              }
              title={t("analyze.initiativeManagement.updateInitiative")}
              modalDescription={t("analyze.initiativeManagement.updateModalDescription")}
              defaultValues={defaultValues(row.original.id)}
            />

            <DeleteInitiativeModal initiativeId={row.original.id} />
          </div>
        );
      },
    },
  ];

  return {
    initiativesToShow,
    pageDataLoading,
    initiativesDataTableColumns,
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
      dateRange,
      setDateRange,
    },
  };
};

export default useInitiativeManagement;
