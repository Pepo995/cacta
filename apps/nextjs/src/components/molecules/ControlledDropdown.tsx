import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

import type { FilterStringKeys } from "~/utils/utilityTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/atoms/SelectInput";
import { cn } from "~/utils";
import ErrorMessage from "../atoms/ErrorMessage";
import { ScrollArea } from "../atoms/ScrollArea";

const selectVariants = cva("bg-white w-full rounded-md", {
  variants: {
    variant: {
      default: "border border-border border-gray/500",
      gray: "border-none bg-gray/200",
    },
    size: {
      big: "h-[61px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type DropdownOption = {
  name: string;
};

type DropdownProps<T extends FieldValues, Q extends DropdownOption> = {
  options: Q[];
  valueKey?: FilterStringKeys<Q>;
  categoryLabel?: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions;
  disabled?: boolean;
} & VariantProps<typeof selectVariants>;

const ControlledDropdown = <T extends FieldValues, Q extends DropdownOption>({
  categoryLabel,
  placeholder,
  control,
  rules,
  name,
  options,
  variant,
  disabled,
  valueKey,
  size,
}: DropdownProps<T, Q>) => (
  <Controller
    name={name}
    rules={rules}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <div className="relative flex w-full flex-col">
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className={cn(selectVariants({ variant, size }))}>
            <div className="w-full truncate text-left">
              <SelectValue placeholder={<p className="text-gray/500">{placeholder}</p>} />
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectGroup>
              <ScrollArea>
                {categoryLabel && <SelectLabel>{categoryLabel}</SelectLabel>}
                {options.map((elem, index) => (
                  <SelectItem
                    value={elem[valueKey ?? "name"] as string}
                    key={index}
                    className="hover:cursor-pointer"
                  >
                    {elem.name}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectGroup>
          </SelectContent>
        </Select>

        <ErrorMessage errorMessage={error?.message} />
      </div>
    )}
  />
);

export default ControlledDropdown;
