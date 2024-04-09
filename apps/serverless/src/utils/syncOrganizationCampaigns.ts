import prisma from "@cacta/db";

import { KpiData } from "./types";

export const syncOrganizationCampaigns = async (organizationId: string, kpiData: KpiData) => {
  // Delete campaigns
  const deletedCampaignsEngineIds = kpiData.organizationCampaigns
    .filter((item) => !!item.deletedAt)
    .map((item) => item.organizationCampaignEngineId);

  await prisma.organizationCampaign.deleteMany({
    where: { engineId: { in: deletedCampaignsEngineIds } },
  });

  // Create and update campaigns
  const syncCampaigns = kpiData.organizationCampaigns.filter((item) => !item.deletedAt);

  const organizationCampaignsIds = await prisma.organizationCampaign.findMany({
    where: { organizationId },
    select: { id: true, engineId: true },
  });

  // Identify new organizationCampaigns and organizationCampaigns to be updated
  const dbOrganizationCampaignsEngineIds = organizationCampaignsIds.map(
    (organizationCampaign) => organizationCampaign.engineId,
  );

  const newOrganizationCampaigns = syncCampaigns.filter(
    (organizationCampaign) =>
      !dbOrganizationCampaignsEngineIds.includes(organizationCampaign.organizationCampaignEngineId),
  );

  const updateOrganizationCampaigns = syncCampaigns.filter((organizationCampaign) =>
    dbOrganizationCampaignsEngineIds.includes(organizationCampaign.organizationCampaignEngineId),
  );

  // For newOrganizationCampaigns, create records in db
  await prisma.organizationCampaign.createMany({
    data: newOrganizationCampaigns.map((item) => ({
      engineId: item.organizationCampaignEngineId,
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate),
      organizationId,
      projectId: item.projectId,
    })),
  });

  // For each updateOrganizationCampaign...
  for (const organizationCampaign of updateOrganizationCampaigns) {
    // Get existing organizationCampaign db id
    const previousOrganizationCampaignId = organizationCampaignsIds.find(
      (item) => item.engineId === organizationCampaign.organizationCampaignEngineId,
    ).id;

    // Create new organizationCampaign with engineId = ""
    const newOrganizationCampaign = await prisma.organizationCampaign.create({
      data: {
        engineId: "",
        startDate: new Date(organizationCampaign.startDate),
        endDate: new Date(organizationCampaign.endDate),
        organizationId,
        projectId: "",
      },
    });

    // Connect all initiatives related to previous organizationCampaign to the new organizationCampaign
    await prisma.initiative.updateMany({
      where: { organizationCampaignId: previousOrganizationCampaignId },
      data: { organizationCampaignId: newOrganizationCampaign.id },
    });

    // Delete previous organizationCampaign
    await prisma.organizationCampaign.delete({ where: { id: previousOrganizationCampaignId } });

    // Update new organizationCampaign to have the correct engineId
    await prisma.organizationCampaign.update({
      where: { id: newOrganizationCampaign.id },
      data: {
        engineId: organizationCampaign.organizationCampaignEngineId,
        projectId: organizationCampaign.projectId,
      },
    });
  }
};
