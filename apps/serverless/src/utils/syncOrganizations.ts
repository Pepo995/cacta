import prisma from "@cacta/db";

import { OrganizationsAndProducts } from "./types";

export const syncOrganizations = async (organizationsAndProducts: OrganizationsAndProducts) => {
  // Delete organizations
  const deletedOrganizationsEngineIds = organizationsAndProducts.organizations
    .filter((organization) => !!organization.deletedAt)
    .map((organization) => organization.engineId);

  await prisma.organization.deleteMany({
    where: { engineId: { in: deletedOrganizationsEngineIds } },
  });

  // Create and update organizations
  const syncOrganizations = organizationsAndProducts.organizations.filter(
    (organization) => !organization.deletedAt,
  );

  const organizations = syncOrganizations.map((organization) => ({
    engineId: organization.engineId,
    name: organization.name,
    imageUrl: organization.imageUrl,
    country: organization.country,
  }));

  await prisma.$transaction(
    organizations.map((organizationData) =>
      prisma.organization.upsert({
        where: { engineId: organizationData.engineId },
        update: organizationData,
        create: organizationData,
      }),
    ),
  );
};
