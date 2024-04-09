import prisma from "@cacta/db";
import { fetchKpiData, fetchOrganizationsAndProducts } from "@utils/fetchData";
import { syncEstablishments } from "@utils/syncEstablishments";
import { syncInputs } from "@utils/syncInputs";
import { syncKpiData } from "@utils/syncKpiData";
import { syncOrganizationCampaigns } from "@utils/syncOrganizationCampaigns";
import { syncOrganizations } from "@utils/syncOrganizations";
import { syncProducts } from "@utils/syncProducts";

const worker = async () => {
  // Get last update date
  const lastUpdated = (await prisma.syncDate.findFirst({ orderBy: { date: "desc" } }))?.date;

  const engineSecretKey = process.env.ENGINE_SECRET_KEY;

  // Fetch engine data updated after lastUpdate date
  console.info("INFO: Fetching organizations and products from engine");
  const organizationsAndProducts = await fetchOrganizationsAndProducts(
    engineSecretKey,
    lastUpdated,
  );

  // Sync organizationAndProducts endpoint
  console.info("INFO: Syncing organizations");
  await syncOrganizations(organizationsAndProducts);

  console.info("INFO: Syncing establishments");
  await syncEstablishments(organizationsAndProducts);

  console.info("INFO: Syncing products");
  await syncProducts(organizationsAndProducts);

  console.info("INFO: Syncing inputs");
  await syncInputs(organizationsAndProducts);

  // Sync kpi data for kpiData/{organizationId} endpoint
  console.info("INFO: Fetching and syncing kpi data from engine");
  const organizations = await prisma.organization.findMany({
    select: { id: true, engineId: true },
  });

  const organizationsEngineIds = organizations.map((organization) => organization.engineId);

  await Promise.all(
    organizationsEngineIds.map(async (organizationEngineId) => {
      const kpiData = await fetchKpiData(organizationEngineId, engineSecretKey, lastUpdated);

      const organizationId = organizations.find(
        (item) => item.engineId === organizationEngineId,
      ).id;

      if (kpiData.organizationCampaigns.length > 0) {
        await syncOrganizationCampaigns(organizationId, kpiData);
        await syncKpiData(organizationId, kpiData);
      }
    }),
  );

  // Add record to syncDate table
  await prisma.syncDate.create({ data: { date: new Date() } });
  console.info("INFO: Syncing finished!");
};

export const main = worker;
