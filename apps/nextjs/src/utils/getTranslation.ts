import { type Prisma } from "@cacta/db";

const translateItem = (item: Prisma.JsonObject, locale?: string) => {
  const translation = item[locale ?? "en"];

  if (typeof translation !== "string") {
    throw Error(
      "The field does not have a translation for the current locale.",
    );
  }

  return translation;
};

function translateField(field: Prisma.JsonValue[], locale?: string): string[];
function translateField(field: Prisma.JsonValue, locale?: string): string;

function translateField(
  field: Prisma.JsonValue | Prisma.JsonValue[],
  locale?: string,
) {
  if (field === null || typeof field !== "object") {
    throw Error("The field is not an object or array.");
  }

  if (field instanceof Array) {
    return field.map((item) => {
      if (item === null || typeof item !== "object" || item instanceof Array) {
        throw Error("The field is not an object.");
      }

      return translateItem(item, locale);
    });
  }

  return translateItem(field, locale);
}

export { translateField };
