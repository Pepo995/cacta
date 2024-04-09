import prisma from "@cacta/db";

import { OrganizationsAndProducts } from "./types";

export const syncInputs = async (organizationsAndProducts: OrganizationsAndProducts) => {
  // Delete inputs
  const deletedInputsEngineIds = organizationsAndProducts.inputs
    .filter((input) => !!input.deletedAt)
    .map((input) => input.engineId);

  await prisma.input.deleteMany({
    where: { engineId: { in: deletedInputsEngineIds } },
  });

  // Create and update inputs
  const syncInputs = organizationsAndProducts.inputs.filter((input) => !input.deletedAt);

  const inputs = syncInputs.map((input) => {
    const { deletedAt, ...rest } = input;

    return {
      ...rest,
      name: { es: input.engineName, en: input.engineName },
    };
  });

  await prisma.$transaction(
    inputs.map((inputData) =>
      prisma.input.upsert({
        where: { engineId: inputData.engineId },
        update: inputData,
        create: inputData,
      }),
    ),
  );
};
