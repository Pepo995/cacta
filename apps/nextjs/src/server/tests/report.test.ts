import {
  type ActivityInput,
  type Kpi,
  type KpiCategory,
  type OrganizationCampaign,
  type ProductCampaign,
} from "@cacta/db";

import {
  activityInputFactory,
  kpiFactory,
  kpiScoreFactory,
  organizationCampaignFactory,
  organizationCampaignScoreFactory,
  organizationFactory,
  productCampaignFactory,
  productFactory,
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

const startDateCampaign1 = new Date(2022, 1, 1);
const startDateCampaign2 = new Date(2023, 1, 1);

const mockedOrganizationCampaign = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  startDate: startDateCampaign2,
};

const organizationCampaign2 = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  startDate: startDateCampaign1,
  endDate: startDateCampaign2,
};

const organizationCampaigns = [mockedOrganizationCampaign, organizationCampaign2];

beforeEach(() => {
  prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
  prismaMock.organizationCampaign.findFirst.mockResolvedValueOnce(mockedOrganizationCampaign);
});

describe("Ecoscore tests", () => {
  it("Should return product and organization campaigns lists", async () => {
    const mockedProduct = productFactory();

    prismaMock.organizationCampaign.findMany.mockResolvedValue(organizationCampaigns);
    prismaMock.product.findMany.mockResolvedValue([mockedProduct]);
    prismaMock.product.count.mockResolvedValue(1);

    const expectedData = organizationCampaigns.map((organizationCampaign) => ({
      id: organizationCampaign.id,
      startDate: organizationCampaign.startDate,
      endDate: organizationCampaign.endDate,
      products: [mockedProduct],
      totalProducts: 1,
    }));

    const data = await callerWithAuth.report.productsAndCampaignsList();

    expect(data).toStrictEqual(expectedData);
  });

  it("Should return expected values for ecoScoreData query - more than one campaign", async () => {
    const mockedKpi = {
      ...kpiFactory(),
      category: "HumanHealth" as KpiCategory,
    };

    const mockedOrganizationScore1 = {
      ...organizationCampaignScoreFactory(),
      organizationCampaignId: organizationCampaign2.id,
    };

    const mockedOrganizationScore2 = {
      ...organizationCampaignScoreFactory(),
      organizationCampaignId: mockedOrganizationCampaign.id,
    };

    const mockedKpiScore1 = {
      ...kpiScoreFactory(),
      organizationCampaignScoreId: mockedOrganizationScore1.id,
      kpiId: mockedKpi.id,
      kpi: mockedKpi,
    };

    const mockedKpiScore2 = {
      ...kpiScoreFactory(),
      organizationCampaignScoreId: mockedOrganizationScore2.id,
      kpiId: mockedKpi.id,
      kpi: mockedKpi,
    };

    prismaMock.organizationCampaign.findMany.mockResolvedValue(organizationCampaigns);
    prismaMock.kpiScore.findMany.mockResolvedValueOnce([mockedKpiScore2]);
    prismaMock.kpiScore.findMany.mockResolvedValueOnce([mockedKpiScore1]);
    prismaMock.organizationCampaignScore.findFirst.mockResolvedValue(mockedOrganizationScore2);

    const data = await callerWithAuth.report.ecoScoreData({
      organizationCampaignId: mockedOrganizationCampaign.id,
    });

    const expectedKpiEcoScores = [
      { categoryKey: "ClimateChange", kpiResults: [] },
      { categoryKey: "EcosystemQuality", kpiResults: [] },
      {
        categoryKey: mockedKpi.category,
        kpiResults: [
          {
            kpiId: mockedKpi.id,
            kpiName: mockedKpi.name,
            ecoScoreValue: mockedKpiScore2.ecoScoreValue,
            ecoScoreGrade: mockedKpiScore2.ecoScoreGrade,
            previousCampaignGrade: mockedKpiScore1.ecoScoreGrade,
          },
        ],
      },
      { categoryKey: "ResourcesExhaustion", kpiResults: [] },
    ];

    expect(data.kpiEcoScores).toStrictEqual(expectedKpiEcoScores);
    expect(data.totalEcoScore).toStrictEqual(mockedOrganizationScore2);
  });

  it("Should return expected values for ecoScoreData query - only one campaign", async () => {
    const mockedKpi = {
      ...kpiFactory(),
      category: "HumanHealth" as KpiCategory,
    };

    const mockedOrganizationScore = {
      ...organizationCampaignScoreFactory(),
      organizationCampaignId: mockedOrganizationCampaign.id,
    };

    const mockedKpiScore = {
      ...kpiScoreFactory(),
      organizationCampaignScoreId: mockedOrganizationScore.id,
      kpiId: mockedKpi.id,
      kpi: mockedKpi,
    };

    prismaMock.organizationCampaign.findMany.mockResolvedValue([mockedOrganizationCampaign]);
    prismaMock.kpiScore.findMany.mockResolvedValueOnce([mockedKpiScore]);
    prismaMock.organizationCampaignScore.findFirst.mockResolvedValue(mockedOrganizationScore);

    const data = await callerWithAuth.report.ecoScoreData({
      organizationCampaignId: mockedOrganizationCampaign.id,
    });

    const expectedKpiEcoScores = [
      { categoryKey: "ClimateChange", kpiResults: [] },
      { categoryKey: "EcosystemQuality", kpiResults: [] },
      {
        categoryKey: mockedKpi.category,
        kpiResults: [
          {
            kpiId: mockedKpi.id,
            kpiName: mockedKpi.name,
            ecoScoreValue: mockedKpiScore.ecoScoreValue,
            ecoScoreGrade: mockedKpiScore.ecoScoreGrade,
            previousCampaignGrade: undefined,
          },
        ],
      },
      { categoryKey: "ResourcesExhaustion", kpiResults: [] },
    ];

    expect(data.kpiEcoScores).toStrictEqual(expectedKpiEcoScores);
    expect(data.totalEcoScore).toStrictEqual(mockedOrganizationScore);
  });
});

describe("Scorecard by product tests", () => {
  it("Should return paginated product campaigns based on search query", async () => {
    const product = {
      ...productFactory(),
      name: { en: "Lemon", es: "Limón" },
    };

    const productCampaignWithProductFactory = () => ({
      ...productCampaignFactory(),
      product,
    });

    const mockedProductCampaign = productCampaignWithProductFactory();

    prismaMock.product.findMany.mockResolvedValueOnce([product]);
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id: mockedProductCampaign.id }]);
    prismaMock.productCampaign.count.mockResolvedValueOnce(1);

    prismaMock.productCampaign.findMany.mockResolvedValueOnce([
      {
        ...mockedProductCampaign,
        establishmentCampaign: {
          organizationCampaign: mockedOrganizationCampaign,
        },
      } as ProductCampaign & {
        establishmentCampaign: {
          organizationCampaign: OrganizationCampaign;
        };
      },
    ]);

    const data = await callerWithAuth.report.getProductScore({
      pageIndex: 0,
      pageSize: 10,
      searchQuery: "Lemon",
      locale: "en",
    });

    expect(data.productCampaigns).toHaveLength(1);
    expect(data.total).toBe(1);
  });

  it("Should handle no search results", async () => {
    prismaMock.product.findMany.mockResolvedValueOnce([]);
    prismaMock.$queryRaw.mockResolvedValueOnce([]);
    prismaMock.productCampaign.count.mockResolvedValueOnce(0);
    prismaMock.productCampaign.findMany.mockResolvedValueOnce([]);

    const data = await callerWithAuth.report.getProductScore({
      pageIndex: 0,
      pageSize: 10,
      searchQuery: "NonExistentProduct",
      locale: "en",
    });

    expect(data.productCampaigns).toHaveLength(0);
    expect(data.total).toBe(0);
  });

  describe("getActivityInputsByProduct method", () => {
    it("should return correctly structured data for valid input", async () => {
      const mockedProductCampaign = productCampaignFactory();
      const kpi = kpiFactory();
      const activityInputs = [activityInputFactory()];

      prismaMock.productCampaign.findMany.mockResolvedValue([
        {
          ...mockedProductCampaign,
          productKpis: [
            {
              kpi,
              activityProductKpis: [{ activityInputs }],
            },
          ],
        } as ProductCampaign & {
          productKpis: {
            kpi: Kpi;
            activityProductKpis: {
              activityInputs: ActivityInput[];
            }[];
          }[];
        },
      ]);

      const result = await callerWithAuth.report.getActivityInputsByProduct({
        organizationCampaignId: "some-id",
        productId: "some-product-id",
      });

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty("categoryName");
      expect(result[0]?.kpis[0]?.totals).toHaveProperty("upstream");
    });
  });
});
