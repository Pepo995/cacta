import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { RiCloseCircleFill } from "react-icons/ri";

import useDebounce from "~/hooks/useDebounce";
import { cn } from "~/utils";
import { Badge } from "../atoms/Badge";
import { ScrollArea } from "../atoms/ScrollArea";

const maxOptLenght = 8;

type Option = {
  name: string;
  countryCode?: string;
  id?: string;
};

type AutocompleteInputProps = {
  completeList: Option[];
  listName: string;
  selectedValues: Option[];
  setSelectedValues: React.Dispatch<React.SetStateAction<Option[]>>;
};

function AutocompleteInput({
  completeList,
  listName,
  selectedValues,
  setSelectedValues,
}: AutocompleteInputProps) {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebounce<string>(query, 600);

  const t = useTranslations();

  const filteredData =
    debouncedValue === ""
      ? completeList
      : completeList.filter((elem: Option) => {
          const displayName = elem.name;
          return String(displayName)
            .toLowerCase()
            .includes(debouncedValue.toLowerCase());
        });

  const handleSelectOption = (option: Option) => {
    const existingValue = selectedValues.findIndex(
      (elem) => elem.name === option.name,
    );

    if (existingValue !== -1) return;

    setSelectedValues((selectedValues) => [...selectedValues, option]);
  };

  const handleRemoveOption = (option: Option) => {
    setSelectedValues((selectedValues) =>
      selectedValues.filter((item) => item.name !== option.name),
    );
  };

  return (
    <Combobox as="div" className="relative space-y-4" value={selectedValues}>
      <Combobox.Input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        className="bg-secondary-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border border-muted px-3 py-2 text-sm font-light text-cancel ring-offset-background file:border-0 file:bg-transparent file:text-sm placeholder:font-light placeholder:text-cancel focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={t("autocompleteInput.add", { name: listName })}
      />

      <Combobox.Options className="absolute z-10 w-full bg-white">
        <ScrollArea
          className={cn(filteredData.length > maxOptLenght ? "h-52" : "h-fit")}
        >
          {filteredData.map((option) => (
            <Combobox.Option
              key={option.id || option.countryCode}
              as="li"
              value={option.id || option.countryCode}
              className="cursor-pointer rounded-md px-3 py-2 hover:bg-highlights"
              onClick={() => handleSelectOption(option)}
            >
              {option.name}
            </Combobox.Option>
          ))}
        </ScrollArea>
      </Combobox.Options>

      <div className="relative">
        <ul className="mt-2 flex flex-wrap space-x-2">
          {selectedValues.map((option) => (
            <Badge
              variant="default"
              className="w-fit px-1 font-normal"
              key={option.id || option.countryCode}
            >
              <div>{option.name}</div>

              <button
                onClick={() => handleRemoveOption(option)}
                className="leading-1 ml-2 p-0"
              >
                <RiCloseCircleFill size={18} className="text-cancel" />
              </button>
            </Badge>
          ))}
        </ul>
      </div>
    </Combobox>
  );
}

export default AutocompleteInput;
