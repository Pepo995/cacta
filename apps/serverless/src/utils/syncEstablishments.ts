import prisma, { SoilType } from "@cacta/db";

import { OrganizationsAndProducts } from "./types";

export const syncEstablishments = async (organizationsAndProducts: OrganizationsAndProducts) => {
  const organizationsIds = await prisma.organization.findMany({
    select: { id: true, engineId: true },
  });

  const engineEstablishments = organizationsAndProducts.organizations.flatMap((organization) =>
    organization.establishments.map((establishment) => ({
      ...establishment,
      soilType: establishment.soilType as SoilType,
      organizationId: organizationsIds.find((item) => item.engineId === organization.engineId).id,
    })),
  );

  // Delete establishments
  const deletedEstablishmentsEngineIds = engineEstablishments
    .filter((establishment) => !!establishment.deletedAt)
    .map((establishment) => establishment.engineId);

  await prisma.establishment.deleteMany({
    where: { engineId: { in: deletedEstablishmentsEngineIds } },
  });

  // Create and update establishments
  const syncEstablishments = engineEstablishments.filter(
    (establishment) => !establishment.deletedAt,
  );

  const establishments = syncEstablishments.map((establishment) => {
    const { deletedAt, ...rest } = establishment;
    return rest;
  });

  await prisma.$transaction(
    establishments.map((establishmentData) =>
      prisma.establishment.upsert({
        where: { engineId: establishmentData.engineId },
        update: establishmentData,
        create: establishmentData,
      }),
    ),
  );
};
