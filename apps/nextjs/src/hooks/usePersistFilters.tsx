import { useEffect } from "react";
import { useRouter } from "next/router";

type PersistFiltersProps = {
  name: string;
  value: string;
}[];

export const usePersistFilters = (filters: PersistFiltersProps) => {
  const router = useRouter();

  const queryParams = new URLSearchParams({});

  filters.forEach(({ name, value }) => {
    if (value.length > 0) {
      queryParams.append(name, value);
    }
  });

  const queryString = queryParams.toString();

  useEffect(() => {
    void router.push({
      pathname: router.asPath.split("?")[0],
      query: queryString,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);
};
