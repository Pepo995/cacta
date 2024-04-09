import { faker } from "@faker-js/faker";
import {
  Activity,
  EcoScoreGrade,
  ElectricitySourceKey,
  Kpi,
  KpiCategory,
  KpiKey,
  PrismaClient,
  Reference,
} from "@prisma/client";

import electricitySourcesData from "../data/electricitySource.json";
import inputsData from "../data/inputs.json";
import kpisData from "../data/kpis.json";
import productsData from "../data/products.json";

const NUMBER_OF_ESTABLISHMENTS = 2;
const prisma = new PrismaClient();

const main = async () => {
  const { id: organizationId } = await prisma.organization.create({
    data: {
      name: "Cacta",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/022/100/778/original/ikea-logo-transparent-free-png.png",
      engineId: faker.string.uuid(),
      country: "AR",
    },
  });

  const kpis: Kpi[] = [];

  for (const kpi of kpisData) {
    const dbKpi = await prisma.kpi.create({
      data: {
        ...kpi,
        category: kpi.category as KpiCategory,
        key: kpi.key as KpiKey,
      },
    });

    kpis.push(dbKpi);
  }

  const user = await prisma.user.create({
    data: {
      email: "cacta@mail.com",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      hashedPassword: "$2a$12$A4hU/G0Or65hf4F9mSmufe2bJeSSnlg2dkkd19ppxFQpEcpSVtNYa",
      pendingVerification: false,
      organizations: { connect: { id: organizationId } },
      homePageKpis: { connect: kpis.map((kpi) => ({ id: kpi.id })) },
    },
  });

  const products = await Promise.all(
    productsData.map(async (item) =>
      prisma.product.create({
        data: { ...item, engineId: faker.string.uuid() },
      }),
    ),
  );

  const electricitySources = await Promise.all(
    electricitySourcesData.map(async (item) =>
      prisma.electricitySource.create({
        data: { ...item, key: item.key as ElectricitySourceKey },
      }),
    ),
  );

  const organizationCampaign = await prisma.organizationCampaign.create({
    data: {
      organizationId,
      engineId: faker.string.uuid(),
      startDate: faker.date.past(),
      projectId: "project-id-01",
    },
  });

  await prisma.establishment.createMany({
    data: Array.from({ length: NUMBER_OF_ESTABLISHMENTS }).map(() => ({
      engineId: faker.string.uuid(),
      name: faker.word.words(2),
      area: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
      latitude: faker.location.latitude({ precision: 6, max: -25, min: -35 }),
      longitude: faker.location.longitude({ precision: 6, max: -63, min: -70 }),
      soilType: faker.helpers.arrayElement([
        "Alfisol",
        "Andisol",
        "Gelisol",
        "Mollisol",
        "Vertisol",
        "Histosol",
        "Inceptisol",
      ]),
      soilPh: faker.number.float({ min: 0, max: 14, precision: 0.01 }),
      organicMaterial: faker.number.float({
        min: 1,
        max: 1000,
        precision: 0.01,
      }),
      nitrogen: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
      phosphorus: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
      organizationId,
    })),
  });

  const establishments = await prisma.establishment.findMany();

  await Promise.all(
    establishments.map(async (establishment) => {
      await prisma.establishmentCampaign.create({
        data: {
          organizationCampaignId: organizationCampaign.id,
          establishmentId: establishment.id,
          startDate: faker.date.past(),
        },
      });
    }),
  );

  const establishmentCampaigns = await prisma.establishmentCampaign.findMany();

  for (const establishmentCampaign of establishmentCampaigns) {
    for (const product of products) {
      const startDate = faker.date.past({
        refDate: "2023-01-01T00:00:00.000Z",
      });

      const endDate = faker.date.between({
        from: startDate,
        to: "2023-01-01T00:00:00.000Z",
      });

      await prisma.productCampaign.create({
        data: {
          startDate,
          endDate,
          harvestedAmount: faker.number.float({
            min: 500,
            max: 1000,
            precision: 0.01,
          }),
          area: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
          establishmentCampaignId: establishmentCampaign.id,
          productId: product.id,
        },
      });
    }
  }

  const productCampaigns = await prisma.productCampaign.findMany();

  const productKpis = await Promise.all(
    productCampaigns.map(async (productCampaign) => {
      const productKpisForCampaign = await Promise.all(
        kpis.map(async (kpi) => {
          const kpiValue = faker.number.float({
            min: 10000,
            max: 100000,
            precision: 0.1,
          });

          return await prisma.productKpi.create({
            data: {
              totalValue: kpiValue,
              kpiId: kpi.id,
              productCampaignId: productCampaign.id,
            },
          });
        }),
      );

      return productKpisForCampaign;
    }),
  );

  const productKpisFlatten = productKpis.flat();

  await Promise.all(
    productKpisFlatten.map(async (productKpi) => {
      const kpi = await prisma.kpi.findFirst({
        where: { id: productKpi.kpiId },
      });

      const sTotal = faker.number.float({ min: 1, max: 100, precision: 0.1 });

      const scope1 = sTotal * faker.number.float({ min: 0.3, max: 0.7, precision: 0.1 });

      const scope2 = (sTotal - scope1) * faker.number.float({ min: 0.2, max: 0.8, precision: 0.1 });

      const scope3 = sTotal - scope1 - scope2;

      if (kpi?.category === "ClimateChange") {
        const scopeId = faker.string.uuid();

        await prisma.scopes.create({
          data: {
            id: scopeId,
            scope1,
            scope2,
            scope3,
            productKpiId: productKpi.id,
          },
        });
      }
    }),
  );

  const waterFootprint = await prisma.kpi.findFirst({
    where: {
      key: { equals: "WaterFootprint" },
    },
  });

  await Promise.all(
    productKpisFlatten.map(async (productKpi) => {
      if (productKpi.kpiId === waterFootprint?.id) {
        const waterCompositionId = faker.string.uuid();
        const totalWaterFootprint = productKpi.totalValue;

        const greenFootprint =
          totalWaterFootprint * faker.number.float({ min: 0.2, max: 0.8, precision: 0.1 });

        const blueFootprint = totalWaterFootprint - greenFootprint;

        await prisma.waterComposition.create({
          data: {
            id: waterCompositionId,
            productKpiId: productKpi.id,
            greenFootprint,
            blueFootprint,
            requiredWater: faker.number.float({
              min: 100,
              max: 1000,
              precision: 0.1,
            }),
            rainfall: faker.number.float({
              min: 100,
              max: 1000,
              precision: 0.1,
            }),
            irrigation: faker.number.float({
              min: 100,
              max: 1000,
              precision: 0.1,
            }),
            lostRainfall: faker.number.float({
              min: -1000,
              max: -100,
              precision: 0.1,
            }),
            lostIrrigation: faker.number.float({
              min: -1000,
              max: -100,
              precision: 0.1,
            }),
            balance: faker.number.float({
              min: -1000,
              max: 1000,
              precision: 0.1,
            }),
          },
        });
      }
    }),
  );

  const useOfElectricity = await prisma.kpi.findFirst({
    where: {
      key: {
        equals: "UseOfElectricity",
      },
    },
  });

  const useOfElectricityProductKpis = productKpisFlatten.filter(
    (productKpi) => productKpi.kpiId === useOfElectricity?.id,
  );

  const productKpiElectricity = useOfElectricityProductKpis.map((productKpi) => {
    return electricitySources.map((electricitySource) => ({
      productKpiId: productKpi.id,
      electricitySourceId: electricitySource.id,
      value: productKpi.totalValue * 0.125,
    }));
  });

  const productKpiElectricityFlattened = productKpiElectricity.flat();

  await prisma.productKpiElectricitySource.createMany({
    data: productKpiElectricityFlattened,
  });

  const organizationProductEcoScores = products.map((product) => ({
    id: faker.string.uuid(),
    ecoScoreGrade: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]) as EcoScoreGrade,
    ecoScoreValue: faker.number.float({
      min: 1,
      max: 100,
      precision: 0.1,
    }),
    organizationCampaignId: organizationCampaign.id,
    productId: product.id,
  }));

  const organizationCampaigEcoScore = {
    id: faker.string.uuid(),
    ecoScoreGrade: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]) as EcoScoreGrade,
    ecoScoreValue: faker.number.float({
      min: 1,
      max: 100,
      precision: 0.1,
    }),
    organizationCampaignId: organizationCampaign.id,
    productId: null,
  };

  await prisma.organizationCampaignScore.createMany({
    data: [organizationCampaigEcoScore, ...organizationProductEcoScores],
  });

  const organizationKpiEcoScores = kpis.map((kpi) => ({
    kpiId: kpi.id,
    ecoScoreGrade: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]) as EcoScoreGrade,
    ecoScoreValue: faker.number.float({
      min: 1,
      max: 100,
      precision: 0.1,
    }),
    organizationCampaignScoreId: organizationCampaigEcoScore.id,
  }));

  const productKpiEcoScores = products.flatMap((product) => {
    return kpis.map((kpi) => ({
      kpiId: kpi.id,
      ecoScoreGrade: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]) as EcoScoreGrade,
      ecoScoreValue: faker.number.float({
        min: 1,
        max: 100,
        precision: 0.1,
      }),
      organizationCampaignScoreId:
        organizationProductEcoScores.find((item) => item.productId === product.id)?.id ?? "",
    }));
  });

  await prisma.kpiScore.createMany({
    data: [...organizationKpiEcoScores, ...productKpiEcoScores],
  });

  const organizationKpiBenchmarks = kpis.map((kpi) => ({
    kpiId: kpi.id,
    benchmark: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
    organizationCampaignId: organizationCampaign.id,
  }));

  const generatePercentages = (amount: number) => {
    let percentages: number[] = [];

    let remainingPercentage = 1;
    for (let i = 0; i < amount - 1; i++) {
      const percentage = Math.random() * remainingPercentage;
      remainingPercentage -= percentage;
      percentages.push(percentage);
    }
    percentages.push(remainingPercentage);

    return percentages;
  };

  for (const organizationKpiBenchmark of organizationKpiBenchmarks) {
    const percentages = generatePercentages(products.length);

    const productBenchmarks = products.map((product) => ({
      productId: product.id,
      benchmark: organizationKpiBenchmark.benchmark * (percentages.pop() ?? 0),
    }));

    await prisma.organizationCampaignKpiBenchmark.create({
      data: {
        ...organizationKpiBenchmark,
        productKpiBenchmarks: {
          createMany: { data: productBenchmarks },
        },
      },
    });
  }

  const inputs = await Promise.all(
    inputsData.map(
      async (item) =>
        await prisma.input.create({
          data: { ...item, engineId: faker.string.uuid() },
        }),
    ),
  );

  const establishmentCampaign = await prisma.establishmentCampaign.findFirst();

  await Promise.all(
    kpis.map(async (kpi, index) => {
      const startDate = faker.date.past({
        refDate: establishmentCampaign?.startDate,
      });
      startDate.setHours(0, 0, 0, 0);

      const endDate = faker.date.future({
        years: 1,
        refDate: establishmentCampaign?.startDate,
      });
      endDate.setHours(0, 0, 0, 0);

      const referenceValues = ["LastCampaign", "Benchmark", "Custom"];

      const numberOfInitiatives = 5;

      const createInitiativesPromises = products.flatMap((product) =>
        Array.from({ length: numberOfInitiatives }, (_, index) =>
          prisma.initiative.create({
            data: {
              organizationCampaignId: organizationCampaign.id,
              name: `Initiative ${index}`,
              kpiId: kpi.id,
              objective: faker.number.float({
                min: 1,
                max: 100,
                precision: 0.1,
              }),
              startDate,
              endDate,
              responsibleId: user?.id ?? faker.datatype.uuid(),
              reference: referenceValues[
                Math.floor(Math.random() * referenceValues.length)
              ] as Reference,
              productId: product.id,
            },
          }),
        ),
      );

      await Promise.all(createInitiativesPromises);
    }),
  );

  const activityValues = Object.values(Activity);

  const activityProductKpis = productKpisFlatten.map((productKpi) => {
    const productKpiValue = productKpi.totalValue;

    const percentages = activityValues.map(() =>
      faker.number.float({ min: 0, max: 0.2, precision: 0.01 }),
    );

    const sum = percentages
      .slice(0, -1)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    percentages[percentages.length - 1] = 1 - sum;

    return activityValues.map((activity, index) => {
      const totalValue = productKpiValue * (percentages[index] ?? 0);

      return {
        activity,
        totalValue,
        productKpiId: productKpi.id,
      };
    });
  });

  const activityProductKpisFlatten = activityProductKpis.flat();

  await prisma.activityProductKpi.createMany({
    data: activityProductKpisFlatten,
  });

  const createdActivityProductKpis = await prisma.activityProductKpi.findMany();

  const activityInputs = createdActivityProductKpis.flatMap((activityProductKpi) => {
    const totalValue = activityProductKpi.totalValue * 0.2;

    const upstream = totalValue * faker.number.float({ min: 0, max: 1, precision: 0.1 });

    const core = (totalValue - upstream) * faker.number.float({ min: 0, max: 1, precision: 0.1 });

    const transportation = totalValue - upstream - core;

    return inputs.map((input) => ({
      totalValue,
      upstream,
      core,
      transportation,
      downstream: 0,
      activityId: activityProductKpi.id,
      inputId: input.id,
    }));
  });

  await prisma.activityInput.createMany({
    data: activityInputs,
  });

  await prisma.adminUser.create({
    data: {
      name: "Cacta Admin",
      email: "cacta@admin.com",
      hashedPassword: "$2a$12$dY5knbc4hhg/Qjg1IuHAbO4sWGfJezfRDEyka6XimT1kS1xa/1xay",
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
