import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";

import { Button } from "~/components/atoms/Button";
import { Calendar } from "~/components/atoms/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/atoms/Popover";
import { cn } from "~/utils";

type DatePickerWithRangeProps = {
  date?: DateRange;
  setDate: (date?: DateRange) => void;
};

export const DatePickerWithRange = ({
  className,
  setDate,
}: React.HTMLAttributes<HTMLDivElement> & DatePickerWithRangeProps) => {
  const [innerDate, setInnerDate] = React.useState<DateRange | undefined>(undefined);
  const t = useTranslations();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-full justify-start text-left font-normal",
              !innerDate && "text-gray/600",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {innerDate?.from ? (
              innerDate.to ? (
                <>
                  {format(innerDate.from, "dd/LL/yyyy")} - {format(innerDate.to, "dd/LL/yyyy")}
                </>
              ) : (
                format(innerDate.from, "dd/LL/yyyy")
              )
            ) : (
              <span>{t("analyze.initiativeManagement.pickDateRange")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onInteractOutside={() => setDate(innerDate)}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={innerDate?.from}
            selected={innerDate}
            onSelect={setInnerDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
