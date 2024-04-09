import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import type { FilterStringKeys } from "~/utils/utilityTypes";
import { cn } from "~/utils";
import ErrorMessage from "../atoms/ErrorMessage";
import { ScrollArea } from "../atoms/ScrollArea";

const maxOptionLength = 8;

export const multiSelectVariants = cva("bg-secondary-foreground w-full", {
  variants: {
    variant: {
      default:
        "border border-border rounded-md py-2 px-3 text-foreground text-left text-sm bg-white h-10",
    },
  },
});

type DropdownOption = {
  name: string;
  id?: string;
};

type GenericMultiSelectProps<
  T extends FieldValues,
  Q extends DropdownOption,
> = {
  options: Q[];
  controlValueLabel: string;
  valueKey?: FilterStringKeys<Q>;
  placeholder: string;
  name: Path<T>;
  disabled?: boolean;
  onChange: (value: string[]) => void;
  value?: string[];
  defaultValue?: string[];
  control: Control<T>;
} & VariantProps<typeof multiSelectVariants>;

type MultiSelectDropdownUncontrolledProps<
  T extends FieldValues,
  Q extends DropdownOption,
> = Omit<GenericMultiSelectProps<T, Q>, "control">;

type MultiSelectDropdownProps<
  T extends FieldValues,
  Q extends DropdownOption,
> = Omit<
  GenericMultiSelectProps<T, Q>,
  "controlValueLabel" | "onChange" | "value" | "defaultValue"
>;

const MultiSelectDropdownUncontrolled = <
  T extends FieldValues,
  Q extends DropdownOption,
>({
  placeholder,
  controlValueLabel,
  name,
  options,
  variant,
  disabled,
  valueKey,
  onChange,
  value,
  defaultValue,
}: MultiSelectDropdownUncontrolledProps<T, Q>) => (
  <div className="relative w-full">
    <Listbox
      name={name}
      onChange={onChange}
      multiple
      disabled={disabled}
      defaultValue={defaultValue}
      value={value}
    >
      <Listbox.Button className={cn(multiSelectVariants({ variant }))}>
        <span
          className={`line-clamp-1 ${
            controlValueLabel?.length > 0 ? "text-foreground" : "text-gray/500"
          }`}
        >
          {controlValueLabel?.length > 0 ? controlValueLabel : placeholder}
        </span>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </span>
      </Listbox.Button>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute top-10 z-10 w-full rounded-md bg-white shadow-default focus:outline-none">
          <ScrollArea
            className={cn(
              "w-full",
              options.length > maxOptionLength ? "h-64" : "h-fit",
            )}
          >
            {options.map((elem, index) => (
              <Listbox.Option
                key={index}
                value={elem[valueKey ?? "name"] as string}
                className={({ active }) =>
                  `data-[disabled] :pointer-events-none relative flex select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none hover:cursor-pointer hover:text-accent-foreground data-[disabled]:opacity-50 ${
                    active ? "bg-gray_16" : "bg-white"
                  }`
                }
              >
                {({ selected }) => (
                  <div>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Check className="h-4 w-4" />
                      </span>
                    )}

                    <span className="font-normal">{elem.name}</span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </ScrollArea>
        </Listbox.Options>
      </Transition>
    </Listbox>
  </div>
);

const MultiSelectDropdown = <T extends FieldValues, Q extends DropdownOption>({
  placeholder,
  control,
  name,
  options,
  variant,
  disabled,
  valueKey,
}: MultiSelectDropdownProps<T, Q>) => {
  const controlValue: string[] = useWatch({ control, name });

  const getOptLabel = (id: string) =>
    options.find((opt) => opt.id === id)?.name;

  const controlValueLabel = controlValue
    ?.map((elem: string) => getOptLabel(elem) ?? "")
    .join(", ");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div>
          <MultiSelectDropdownUncontrolled
            controlValueLabel={controlValueLabel}
            name={name}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            defaultValue={value}
            variant={variant}
            disabled={disabled}
            valueKey={valueKey}
          />

          <ErrorMessage errorMessage={error?.message} className="m-0" />
        </div>
      )}
    />
  );
};

export { MultiSelectDropdownUncontrolled, MultiSelectDropdown };
