export const getNameAcronym = (name?: string) =>
  name
    ?.split(" ")
    .map((word) => word[0]?.toUpperCase())
    .splice(0, 2)
    .join("") ?? "";
