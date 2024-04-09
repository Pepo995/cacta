import React, { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Eye, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/atoms/DropdownMenu";
import TextInput from "~/components/atoms/TextInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/molecules/Table";
import { Skeleton } from "../atoms/Skeleton";
import Pagination from "../molecules/Pagination";

type ManualPagination = {
  total: number;
  pageIndex: number;
  pageSize: number;
  setPageIndex: (index: number) => void;
  setPageSize: (pageSize: number) => void;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  customHeader?: ReactElement;
  enablePagination?: boolean;
  manualPagination?: ManualPagination;
  tableKey?: string;
  isLoading?: boolean;
  textColor?: string;
};

const TableShimmer = ({ columns }: { columns: number }) => (
  <TableRow>
    <TableCell colSpan={columns}>
      <Skeleton className="h-[22px] w-full" />
    </TableCell>
  </TableRow>
);

export const DataTable = <TData, TValue>({
  columns,
  data,
  customHeader,
  enablePagination = true,
  manualPagination,
  tableKey = "",
  isLoading,
}: DataTableProps<TData, TValue>) => {
  const t = useTranslations();
  const router = useRouter();

  const initialPageIndex = router.query[`${tableKey}page`] as string;
  const initialPageSize = router.query[`${tableKey}size`] as string;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const {
    getRowModel,
    getCanNextPage,
    getCanPreviousPage,
    getPageCount,
    setPageSize,
    setPageIndex,
    ...table
  } = useReactTable({
    data,
    columns,
    enableGlobalFilter: true,
    globalFilterFn: "includesString",
    manualPagination: !!manualPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      enablePagination && !manualPagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    manualSorting: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageSize: initialPageSize ? Number(initialPageSize) : 10,
        pageIndex: initialPageIndex ? Number(initialPageIndex) : 0,
      },
    },
  });

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();

  const rowsToMap = getRowModel().rows;
  const rowSize = 52;

  const rowCount = () => {
    if (enablePagination) {
      if (initialPageSize) {
        return Number(initialPageSize) + 1;
      }

      if (manualPagination) {
        return manualPagination.pageSize + 1;
      }

      return pageSize + 1;
    }

    if (rowsToMap) {
      return rowsToMap.length + 1;
    }

    return 0;
  };

  const minHeight = rowCount() * rowSize;

  useEffect(() => {
    if (manualPagination) {
      if (initialPageIndex) {
        manualPagination.setPageIndex(Number(initialPageIndex));
      }

      if (initialPageSize) {
        manualPagination.setPageSize(Number(initialPageSize));
      }
    }
  }, [initialPageIndex, initialPageSize, manualPagination]);

  return (
    <div className="border-black_5 rounded-xxl bg-white px-4 py-6">
      {customHeader ?? (
        <div className="mb-4 flex w-full items-center gap-4">
          <div className="text-black_40 w-full">
            <TextInput
              placeholder={t("dataTable.searchPlaceholder")}
              value={globalFilter ?? ""}
              onChange={(event) => {
                setGlobalFilter(event.target.value);
              }}
              className="border-light_grey h-10 w-full border border-gray/300 placeholder:text-xs"
              type="text"
              icon={<Search size={18} />}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <div className="flex items-center gap-2 text-xs font-normal">
                  <Eye size={18} />
                  {t("dataTable.view")}
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div
        style={{
          minHeight: `${minHeight}px`,
        }}
      >
        <Table className="text-xs">
          <TableHeader className="border-none bg-gray/100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-none" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray/700">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({
                length: manualPagination?.pageSize ?? pageSize,
              }).map((_, index) => <TableShimmer key={index} columns={columns.length} />)
            ) : getRowModel().rows?.length ? (
              getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-black_20 text-dark_grey border-dashed"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("dataTable.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <Pagination
          pageSize={manualPagination?.pageSize ?? pageSize}
          setPageSize={(pageSize) =>
            manualPagination ? manualPagination.setPageSize(pageSize) : setPageSize(pageSize)
          }
          goToPage={manualPagination ? manualPagination.setPageIndex : setPageIndex}
          canPreviousPage={manualPagination ? manualPagination.pageIndex > 0 : getCanPreviousPage()}
          canNextPage={
            manualPagination
              ? (manualPagination.pageIndex + 1) * manualPagination.pageSize <
                manualPagination.total
              : getCanNextPage()
          }
          pageCount={
            manualPagination
              ? Math.ceil(manualPagination.total / manualPagination.pageSize)
              : getPageCount()
          }
          pageIndex={manualPagination?.pageIndex ?? pageIndex}
          tableKey={tableKey}
        />
      )}
    </div>
  );
};
