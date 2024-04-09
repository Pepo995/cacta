import axios from "axios";

import { KpiData, OrganizationsAndProducts } from "./types";

export const fetchOrganizationsAndProducts = async (
  engineSecretKey: string,
  lastUpdated?: Date,
) => {
  const urlQuery = lastUpdated ? `?lastUpdated=${lastUpdated.toISOString()}` : "";
  const organizationsAndProductsUrl = `https://demo.cacta.eco/engine/platform/organizationsAndProducts${urlQuery}`;

  const config = {
    headers: { Authorization: `Bearer ${engineSecretKey}` },
  };

  try {
    const response = await axios.get<OrganizationsAndProducts>(organizationsAndProductsUrl, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

export const fetchKpiData = async (
  organizationEngineId: string,
  engineSecretKey: string,
  lastUpdated?: Date,
) => {
  const urlQuery = lastUpdated
    ? `?organizationId=${organizationEngineId}&lastUpdated=${lastUpdated.toISOString()}`
    : `?organizationId=${organizationEngineId}`;

  const kpiDataUrl = `https://demo.cacta.eco/engine/platform/kpiData${urlQuery}`;

  const config = {
    headers: { Authorization: `Bearer ${engineSecretKey}` },
  };

  try {
    const response = await axios.get<KpiData>(kpiDataUrl, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};
