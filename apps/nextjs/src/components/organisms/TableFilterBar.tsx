import { type Dispatch, type SetStateAction } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";

import TextInput from "../atoms/TextInput";
import { DatePickerWithRange } from "../molecules/RangeDatePicker";

type GenericFilter<T> = {
  setFilter: Dispatch<SetStateAction<T>>;
  filter: T;
};

type FilterProps = {
  queryFilter?: GenericFilter<string>;
  dateFilter?: GenericFilter<DateRange | undefined>;
  searchPlaceholder?: string;
};

const FilterBar = ({ queryFilter, dateFilter, searchPlaceholder }: FilterProps) => {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl rounded-b-none md:flex-row">
      {queryFilter && (
        <div className="w-full">
          <TextInput
            placeholder={searchPlaceholder ?? t("filter.search")}
            className="h-10 border border-gray_24 placeholder:text-cancel"
            type="text"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              queryFilter.setFilter(event.target.value)
            }
            icon={<Search size={12} className="text-cancel" />}
            defaultValue={queryFilter.filter}
          />
        </div>
      )}

      {dateFilter && (
        <DatePickerWithRange className="h-10 min-w-[276px]" setDate={dateFilter.setFilter} />
      )}
    </div>
  );
};

export default FilterBar;
