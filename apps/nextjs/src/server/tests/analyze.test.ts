import { type Activity, type KpiKey } from "@cacta/db";

import { type EnergyClassification } from "~/utils/types";
import {
  activityInputFactory,
  activityProductKpiFactory,
  electricitySourceFactory,
  inputFactory,
  kpiBenchmarkFactory,
  kpiFactory,
  organizationCampaignFactory,
  organizationFactory,
  productCampaignFactory,
  productFactory,
  productKpiElectricitySourceFactory,
  productKPIFactory,
  waterCompositionFactory,
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

describe("Performance per kpi page - View Panel", () => {
  it("Should product and kpi lists for a given category", async () => {
    const mockedProduct = productFactory();
    const mockedKpi = kpiFactory();
    prismaMock.product.findMany.mockResolvedValue([mockedProduct]);
    prismaMock.kpi.findMany.mockResolvedValue([mockedKpi]);

    const data = await callerWithAuth.analyze.productsAndKpisList({
      category: "ClimateChange",
    });

    expect(data.productsList).toStrictEqual([mockedProduct]);
    expect(data.kpisList).toStrictEqual([mockedKpi]);
  });

  it("Should return all expected values for given category", async () => {
    const mockedProduct = productFactory();

    const mockedKpiBenchmark = {
      ...kpiBenchmarkFactory([mockedProduct.id]),
      organizationCampaignId: mockedOrganizationCampaign.id,
    };

    const mockedProductCampaign = {
      ...productCampaignFactory(),
      productId: mockedProduct.id,
    };

    const mockedKpi = kpiFactory();
    const mockedProductKPI = { ...productKPIFactory(), kpiId: mockedKpi.id };
    const mockedInput = inputFactory();

    const mockedActivityProductKpi1 = {
      ...activityProductKpiFactory(),
      productKpiId: mockedProductKPI.id,
      activity: "Other" as Activity,
    };

    const mockedActivityProductKpi2 = {
      ...activityProductKpiFactory(),
      productKpiId: mockedProductKPI.id,
      activity: "Agrochemicals" as Activity,
    };

    const mockedActivityInput1 = {
      ...activityInputFactory(),
      activityId: mockedActivityProductKpi1.id,
      inputId: mockedInput.id,
    };

    const mockedActivityInput2 = {
      ...activityInputFactory(),
      activityId: mockedActivityProductKpi2.id,
      inputId: mockedInput.id,
    };

    prismaMock.organizationCampaignKpiBenchmark.findFirst.mockResolvedValue(mockedKpiBenchmark);

    prismaMock.activityProductKpi.findMany.mockResolvedValue([
      mockedActivityProductKpi1,
      mockedActivityProductKpi2,
    ]);

    prismaMock.activityInput.findMany.mockResolvedValue([
      mockedActivityInput1,
      mockedActivityInput2,
    ]);

    prismaMock.productCampaign.findMany.mockResolvedValue([mockedProductCampaign]);

    prismaMock.productKpi.findMany.mockResolvedValue([mockedProductKPI]);

    const data = await callerWithAuth.analyze.performancePanel({
      category: "ClimateChange",
      productIdFilter: mockedProduct.id,
      kpiIdFilter: mockedKpi.id,
    });

    expect(data.activitiesList).toStrictEqual([
      mockedActivityProductKpi1.activity,
      mockedActivityProductKpi2.activity,
    ]);

    expect(data.activityProductKpis).toStrictEqual([
      mockedActivityProductKpi1,
      mockedActivityProductKpi2,
    ]);

    expect(data.activityInputs).toStrictEqual([mockedActivityInput1, mockedActivityInput2]);
    expect(data.benchmark).toStrictEqual(mockedKpiBenchmark.productKpiBenchmarks[0]?.benchmark);
    expect(data.selectedProductAmount).toStrictEqual(mockedProductCampaign.harvestedAmount);
    expect(data.organizationCampaign).toStrictEqual(mockedOrganizationCampaign);
    expect(data.totalKpi).toStrictEqual(mockedProductKPI.totalValue);
  });

  it("Should return all expected values for given category", async () => {
    const mockedKpi = kpiFactory();
    const mockedProductKPI = { ...productKPIFactory(), kpiId: mockedKpi.id };

    const mockedActivityProductKpi1 = {
      ...activityProductKpiFactory(),
      productKpiId: mockedProductKPI.id,
      activity: "Other" as Activity,
      productKpi: mockedProductKPI,
    };

    const mockedActivityProductKpi2 = {
      ...activityProductKpiFactory(),
      productKpiId: mockedProductKPI.id,
      activity: "Agrochemicals" as Activity,
      productKpi: mockedProductKPI,
    };

    prismaMock.user.findUnique.mockResolvedValue(mockedUser);
    prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);

    prismaMock.activityProductKpi.findMany.mockResolvedValue([
      mockedActivityProductKpi1,
      mockedActivityProductKpi2,
    ]);

    prismaMock.kpi.findMany.mockResolvedValue([mockedKpi]);

    const data = await callerWithAuth.analyze.performanceStages({
      category: "ClimateChange",
    });

    const expectedActivityProductKpisByKpi = [
      {
        kpiId: mockedKpi.id,
        activityProductKpis: [mockedActivityProductKpi1, mockedActivityProductKpi2],
      },
    ];

    expect(data.activitiesList).toStrictEqual([
      mockedActivityProductKpi1.activity,
      mockedActivityProductKpi2.activity,
    ]);

    expect(data.activityProductKpisByKpi).toStrictEqual(expectedActivityProductKpisByKpi);
  });

  it("Should get electricity use data when that kpi is selected", async () => {
    const mockedProduct = productFactory();
    const mockedKpi = kpiFactory();

    const mockedProductKpi = {
      ...productKPIFactory(),
      productId: mockedProduct.id,
      kpiId: mockedKpi.id,
    };

    const mockedElectricitySource = {
      ...electricitySourceFactory(),
      renewable: true,
    };

    const mockedProductKpiElectricitySource = {
      ...productKpiElectricitySourceFactory(),
      productKpiId: mockedProductKpi.id,
      electricitySourceId: mockedElectricitySource.id,
    };

    prismaMock.productKpi.findMany.mockResolvedValue([mockedProductKpi]);

    prismaMock.productKpiElectricitySource.findMany.mockResolvedValue([
      mockedProductKpiElectricitySource,
    ]);

    prismaMock.electricitySource.findMany.mockResolvedValue([mockedElectricitySource]);

    const expectedElectricitySources = [
      {
        id: mockedElectricitySource.id,
        value: mockedProductKpiElectricitySource.value,
        key: mockedElectricitySource.key,
        name: mockedElectricitySource.name,
        renewable: mockedElectricitySource.renewable,
        updatedAt: mockedElectricitySource.updatedAt,
        createdAt: mockedElectricitySource.createdAt,
      },
    ];

    const expectedClassification = [
      {
        key: "renewable" as EnergyClassification,
        value: 100,
      },
      {
        key: "nonRenewable" as EnergyClassification,
        value: 0,
      },
    ];

    const data = await callerWithAuth.analyze.electricity({});

    expect(data.electricitySources).toStrictEqual(expectedElectricitySources);
    expect(data.classification).toStrictEqual(expectedClassification);
  });

  it("Should get water composition data when water footprint kpi is selected", async () => {
    const mockedProduct = productFactory();
    const mockedKpi = kpiFactory();
    const mockedWaterComposition = waterCompositionFactory();
    const mockedProductCampaign = productCampaignFactory();

    const mockedProductKpi = {
      ...productKPIFactory(),
      productId: mockedProduct.id,
      kpiId: mockedKpi.id,
      waterCompositionId: mockedWaterComposition.id,
      waterComposition: mockedWaterComposition,
      productCampaingId: mockedProductCampaign.id,
      productCampaign: mockedProductCampaign,
    };

    prismaMock.productKpi.findMany.mockResolvedValueOnce([mockedProductKpi]);

    const mockedWaterProductivityKpi = {
      ...kpiFactory(),
      key: "WaterProductivity" as KpiKey,
    };

    const mockedKpiBenchmark = {
      ...kpiBenchmarkFactory(),
      kpiId: mockedWaterProductivityKpi.id,
      organizationCampaignId: mockedOrganizationCampaign.id,
    };

    const mockedProductKpiWaterProductiviy = {
      ...productKPIFactory(),
      kpiId: mockedWaterProductivityKpi.id,
    };

    prismaMock.kpi.findFirst.mockResolvedValue(mockedWaterProductivityKpi);
    prismaMock.organizationCampaignKpiBenchmark.findFirst.mockResolvedValue(mockedKpiBenchmark);
    prismaMock.productKpi.findMany.mockResolvedValueOnce([mockedProductKpiWaterProductiviy]);

    const expectedBarChartData = [
      { key: "requiredWater", value: mockedWaterComposition.requiredWater },
      { key: "rainfall", value: mockedWaterComposition.rainfall },
      { key: "irrigation", value: mockedWaterComposition.irrigation },
      { key: "lostRainfall", value: mockedWaterComposition.lostRainfall },
      { key: "lostIrrigation", value: mockedWaterComposition.lostIrrigation },
      { key: "balance", value: mockedWaterComposition.balance },
    ];

    const totalFootprints =
      mockedWaterComposition.blueFootprint + mockedWaterComposition.greenFootprint;

    const expectedFootprints = [
      {
        key: "blueFootprint",
        value: (mockedWaterComposition.blueFootprint / totalFootprints) * 100,
      },
      {
        key: "greenFootprint",
        value: (mockedWaterComposition.greenFootprint / totalFootprints) * 100,
      },
    ];

    const expectedWaterProductivity = {
      name: mockedWaterProductivityKpi.name,
      value: mockedProductKpiWaterProductiviy.totalValue,
      unit: mockedWaterProductivityKpi.unit,
      benchmark: mockedKpiBenchmark.benchmark,
    };

    const data = await callerWithAuth.analyze.waterComposition({});

    expect(data.barChartData).toStrictEqual(expectedBarChartData);
    expect(data.footprints).toStrictEqual(expectedFootprints);
    expect(data.waterProductivity).toStrictEqual(expectedWaterProductivity);
  });
});
