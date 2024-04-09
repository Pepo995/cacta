import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { type FieldError } from "react-hook-form";
import { type IconType } from "react-icons";

import { cn } from "~/utils";
import { Button } from "../atoms/Button";
import { Calendar } from "../atoms/Calendar";
import ErrorMessage from "../atoms/ErrorMessage";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/Popover";

type DatePickerProps = {
  title: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  Icon?: IconType;
  error?: FieldError;
  closeOnClick?: boolean;
};

const DatePicker = ({
  className,
  title,
  date,
  setDate,
  Icon,
  error,
  closeOnClick,
}: DatePickerProps & React.HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start border-none bg-gray/200 text-left font-primary font-normal",
              !date && "text-gray/600",
              className,
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}

            {date ? format(date, "PP") : <span>{title}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            className="font-primary"
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);

              if (closeOnClick) {
                setOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <ErrorMessage errorMessage={error?.message} />
    </div>
  );
};

export default DatePicker;
