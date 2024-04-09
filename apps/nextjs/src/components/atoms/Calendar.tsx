"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "~/utils";
import { buttonVariants } from "../atoms/Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn("p-3 font-secondary", className)}
    classNames={{
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "text-sm font-medium",
      nav: "space-x-1 flex items-center",
      nav_button: cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
      ),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: cn(
        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary ",
        props.mode === "range"
          ? "[&:has(>.day-range-end)]:rounded-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
          : "[&:has([aria-selected])]:rounded-md",
      ),
      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
      day_selected: "bg-secondary text-white",
      day_today: "border-[1px] border-black",
      day_outside: "text-muted-foreground opacity-50",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle: "aria-selected:bg-primary aria-selected:text-accent-foreground",
      day_hidden: "invisible",
      ...classNames,
    }}
    components={{
      IconLeft: () => <ChevronLeft className="h-4 w-4" />,
      IconRight: () => <ChevronRight className="h-4 w-4" />,
    }}
    {...props}
  />
);
Calendar.displayName = "Calendar";

export { Calendar };
