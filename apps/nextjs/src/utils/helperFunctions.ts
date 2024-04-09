import { type KpiKey } from "@cacta/db";

import { type TFunction } from "./nextIntl";

export const isSelected = (id: string, selectedItems: string[]) =>
  !!selectedItems?.find((item) => item === id);

export const dateToString = (date: Date | null, t: TFunction) =>
  date ? `${date.getMonth()}/${date.getFullYear()}` : t("text.present");

export const normalizeString = (string: string) => {
  return string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const intensityKPI = (kpiKey: KpiKey) => kpiKey === "WaterProductivity";

export const replaceSubscriptNumbers = (text: string) => {
  const pattern = /([₀-₉])/g;

  return text.replace(pattern, (match) => (match.charCodeAt(0) - "₀".charCodeAt(0)).toString());
};
