import { stringify } from "querystring";
import React from "react";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "../atoms/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/SelectInput";

type PaginationProps = {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  pageIndex: number;
  pageCount: number;
  goToPage: (pageIndex: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  tableKey?: string;
};

const Pagination = ({
  pageSize,
  setPageSize,
  pageIndex,
  pageCount,
  goToPage,
  canPreviousPage,
  canNextPage,
  tableKey = "",
}: PaginationProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { query } = router;

  const possibleRowsPerPage = [5, 10, 20, 30, 40, 50];

  const updatePageQuery = async (page: number) => {
    const newQuery = `?${stringify({
      ...query,
      [`${tableKey}page`]: page,
    })}`;
    await router.push(newQuery, undefined, {
      shallow: true,
    });
  };

  const updateSizeQuery = async (size: number) => {
    const newQuery = `?${stringify({
      ...query,
      [`${tableKey}size`]: size,
    })}`;
    await router.push(newQuery, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="mt-4 flex w-full items-center justify-end pr-4">
      <div className="flex items-center space-x-2">
        <p className="mr-1 text-sm">{t("dataTable.rowsPerPage")}</p>

        <Select
          value={`${pageSize}`}
          onValueChange={async (value) => {
            setPageSize(Number(value));
            await updateSizeQuery(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>

          <SelectContent side="top">
            {possibleRowsPerPage.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-[100px] items-center justify-center text-sm">
        {t("dataTable.pageCounter", {
          actualPage: (pageIndex + 1).toString(),
          totalPages: pageCount.toString(),
        })}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          className="h-8 w-8 p-0"
          onClick={async () => {
            goToPage(pageIndex - 1);
            await updatePageQuery(pageIndex - 1);
          }}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">{t("dataTable.goToPreviousPage")}</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          className="h-8 w-8 p-0"
          onClick={async () => {
            goToPage(pageIndex + 1);
            await updatePageQuery(pageIndex + 1);
          }}
          disabled={!canNextPage}
        >
          <span className="sr-only">{t("dataTable.goToNextPage")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
