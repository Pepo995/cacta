import {
  establishmentFactory,
  establishmentsCampaignFactory,
  kpiFactory,
  organizationCampaignFactory,
  organizationFactory,
  productCampaignFactory,
  productKPIFactory,
} from "./factories";
import { callerWithAuth, prismaMock } from "./jestConfig/jest.setup";

const mockedOrganization = {
  ...organizationFactory(),
  id: "clnozqepw0000zwwagrpd8wdv",
};

const mockedUser = {
  id: "clkk1z92x0000gqrhvw0lusqj",
  hashedPassword: "password",
  email: "john@doe.com",
  firstName: "John",
  lastName: "Doe",
  pendingVerification: false,
  profilePictureUrl: "imagen.jpg",
  organizations: [mockedOrganization],
  createdAt: new Date(1, 1, 2000),
  updatedAt: new Date(1, 1, 2000),
};

const mockedOrganizationCampaign = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  organization: mockedOrganization,
};

beforeEach(() => {
  prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
  prismaMock.organizationCampaign.findFirst.mockResolvedValueOnce(mockedOrganizationCampaign);
});

describe("Monitor router tests", () => {
  describe("Summary by product page", () => {
    it("Should return organizationKpi and productKpi for given category", async () => {
      const mockedKpi = kpiFactory();
      const mockedProductKPI = productKPIFactory();

      prismaMock.kpi.findMany.mockResolvedValue([mockedKpi]);
      prismaMock.productKpi.findMany.mockResolvedValue([mockedProductKPI]);

      const data = await callerWithAuth.monitor.summaryByProduct({
        category: "ClimateChange",
      });

      expect(data.kpiBenchmarks).toStrictEqual([mockedKpi]);
      expect(data.productKpis).toStrictEqual([mockedProductKPI]);
    });
  });

  describe("Summary by Establishment page", () => {
    it("Should return establishmentCampaigns for given category", async () => {
      const mockedEstablishment = {
        ...establishmentFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedProductsCampaigns = {
        ...productCampaignFactory(),
      };

      const mockedEstablishmentsCampaigns = {
        ...establishmentsCampaignFactory(),
        organizationCampaignId: mockedOrganizationCampaign.id,
        establishmentId: mockedEstablishment.id,
        productCampaigns: [mockedProductsCampaigns],
      };

      prismaMock.establishmentCampaign.findMany.mockResolvedValue([mockedEstablishmentsCampaigns]);
      prismaMock.productCampaign.findMany.mockResolvedValue([mockedProductsCampaigns]);

      const data = await callerWithAuth.monitor.summaryByEstablishment({
        category: "ClimateChange",
      });

      expect(data).toStrictEqual([mockedEstablishmentsCampaigns]);
    });
  });
});
