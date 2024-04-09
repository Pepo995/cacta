import { type KpiCategory, type KpiKey } from "@cacta/db";
import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";

import {
  kpiBenchmarkFactory,
  organizationCampaignFactory,
  organizationFactory,
  productCampaignFactory,
  productKPIFactory,
  userFactory,
} from "./factories";
import { callerWithAuth, prismaMock } from "./jestConfig/jest.setup";

describe("Home page router tests", () => {
  describe("Home page data (polar area chart)", () => {
    it("Should return homePage data and logoUrl", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedProduct = {
        id: "product-1",
        name: { es: "Limón", en: "Lemon" },
        imageUrl: faker.internet.url(),
        createdAt: new Date(1, 1, 2000),
        updatedAt: new Date(1, 1, 2000),
      };

      const mockedKpi_1 = {
        id: "kpi-1",
        name: { es: "Smog", en: "Smog" },
        description: { es: "Descripción", en: "Description" },
        imageUrl: faker.internet.url(),
        unit: "NMVOC eq",
        category: "HumanHealth" as KpiCategory,
        key: "Smog" as KpiKey,
        createdAt: new Date(1, 1, 2000),
        updatedAt: new Date(1, 1, 2000),
      };

      const mockedKpi_2 = {
        id: "kpi-2",
        name: { es: "Canerígeno", en: "Carcinogenic" },
        description: { es: "Descripción", en: "Description" },
        imageUrl: faker.internet.url(),
        unit: "CTUh",
        category: "HumanHealth" as KpiCategory,
        key: "Carcinogenic" as KpiKey,
        createdAt: new Date(1, 1, 2000),
        updatedAt: new Date(1, 1, 2000),
      };

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        homePageKpis: [mockedKpi_1, mockedKpi_2],
        organizations: [mockedOrganization],
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
        organization: mockedOrganization,
      };

      const mockedKpiBenchmark_1 = {
        ...kpiBenchmarkFactory(),
        organizationCampaignId: mockedOrganizationCampaign.id,
        kpiId: mockedKpi_1.id,
      };

      const mockedKpiBenchmark_2 = {
        ...kpiBenchmarkFactory(),
        organizationCampaignId: mockedOrganizationCampaign.id,
        kpiId: mockedKpi_2.id,
      };

      const mockedProductCampaign = {
        ...productCampaignFactory(),
        productId: mockedProduct.id,
      };

      const mockedProductKPI_1 = {
        ...productKPIFactory(),
        kpiId: mockedKpi_1.id,
        productCampaignId: mockedProductCampaign.id,
        productCampaign: {
          ...mockedProductCampaign,
          product: mockedProduct,
        },
      };

      const mockedProductKPI_2 = {
        ...productKPIFactory(),
        kpiId: mockedKpi_2.id,
        productCampaignId: mockedProductCampaign.id,
        productCampaign: {
          ...mockedProductCampaign,
          product: mockedProduct,
        },
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);

      prismaMock.organizationCampaignKpiBenchmark.findMany.mockResolvedValue([
        mockedKpiBenchmark_1,
        mockedKpiBenchmark_2,
      ]);

      prismaMock.productKpi.findMany.mockResolvedValue([mockedProductKPI_1, mockedProductKPI_2]);

      const data = await callerWithAuth.homePage.homePageData();

      expect(data.homePageData).toStrictEqual([
        {
          id: mockedKpi_1.id,
          benchmark: mockedKpiBenchmark_1.benchmark,
          totalValue: mockedProductKPI_1.totalValue / mockedProductCampaign.harvestedAmount,
          name: mockedKpi_1.name,
          category: "HumanHealth",
          description: mockedKpi_1.description,
          products: [
            {
              name: mockedProduct.name,
              value: mockedProductKPI_1.totalValue / mockedProductCampaign.harvestedAmount,
            },
          ],
        },
        {
          id: mockedKpi_2.id,
          benchmark: mockedKpiBenchmark_2.benchmark,
          totalValue: mockedProductKPI_2.totalValue / mockedProductCampaign.harvestedAmount,
          name: mockedKpi_2.name,
          category: "HumanHealth",
          description: mockedKpi_2.description,
          products: [
            {
              name: mockedProduct.name,
              value: mockedProductKPI_2.totalValue / mockedProductCampaign.harvestedAmount,
            },
          ],
        },
      ]);

      expect(data.logoUrl).toStrictEqual(mockedOrganization.imageUrl);
    });

    it("Should throw an error if the user is not found", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        organizations: [mockedOrganization],
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
        organization: mockedOrganization,
      };

      prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(callerWithAuth.homePage.homePageData()).rejects.toThrow(TRPCError);
    });
  });
});
