import prisma, {
  Activity,
  EcoScoreGrade,
  ElectricitySourceKey,
  Scopes,
  WaterComposition,
} from "@cacta/db";

import { KpiData } from "./types";

type ElectricitySourceData = {
  electricitySourceKey: ElectricitySourceKey;
  value: number;
};

export const syncKpiData = async (organizationId: string, kpiData: KpiData) => {
  // Get necessary data from db
  const kpiKeysAndIds = await prisma.kpi.findMany({ select: { id: true, key: true } });
  const productsIds = await prisma.product.findMany({ select: { id: true, engineId: true } });
  const inputsIds = await prisma.input.findMany({ select: { id: true, engineId: true } });

  const electricitySourcesIds = await prisma.electricitySource.findMany({
    select: { id: true, key: true },
  });

  const establishmentsIds = await prisma.establishment.findMany({
    select: { id: true, engineId: true },
  });

  const organizationCampaignsIds = await prisma.organizationCampaign.findMany({
    where: { organizationId },
    select: { id: true, engineId: true },
  });

  // For each organizationCampaign...
  await Promise.all(
    kpiData.organizationCampaigns.map(async (organizationCampaign) => {
      // Get organizationCampaignId for current organizationCampaign from db
      const organizationCampaignId = organizationCampaignsIds.find(
        (item) => item.engineId === organizationCampaign.organizationCampaignEngineId,
      ).id;

      // ----- KPI BENCHMARKS ------
      // Create organizationCampaignKpiBenchmarks
      const organizationCampaignKpiBenchmarksData = organizationCampaign.kpiBenchmarks.map(
        (item) => ({
          benchmark: item.benchmark,
          kpiId: kpiKeysAndIds.find((kpi) => kpi.key === item.kpiKey).id,
          organizationCampaignId,
        }),
      );

      await prisma.organizationCampaignKpiBenchmark.createMany({
        data: organizationCampaignKpiBenchmarksData,
      });

      // Get created organizationCampaignKpiBenchmarks from db
      const dbOrganizationCampaignKpiBenchmarks =
        await prisma.organizationCampaignKpiBenchmark.findMany({
          where: { organizationCampaignId },
          select: { kpi: { select: { key: true } }, id: true },
        });

      // For each organizationCampaignKpiBenchmark...
      await Promise.all(
        organizationCampaign.kpiBenchmarks.map(async (kpiBenchmark) => {
          // Get organizationCampaignKpiBenchmarkId for current kpiBenchmark
          const organizationCampaignKpiBenchmarkId = dbOrganizationCampaignKpiBenchmarks.find(
            (item) => item.kpi.key === kpiBenchmark.kpiKey,
          ).id;

          // Create productKpiBenchmarks
          const productKpiBenchmarkData = kpiBenchmark.productKpiBenchmarks.map((item) => ({
            benchmark: item.benchmark,
            productId: productsIds.find((product) => product.engineId === item.productEngineId).id,
            organizationCampaignKpiBenchmarkId,
          }));

          await prisma.productKpiBenchmark.createMany({ data: productKpiBenchmarkData });
        }),
      );

      // ----- ECOSCORES ------
      // Create organizationCampaignScores
      const organizationCampaignScoreData = organizationCampaign.ecoScores.map((item) => ({
        ecoScoreValue: item.ecoScoreValue,
        ecoScoreGrade: item.ecoScoreGrade as EcoScoreGrade,
        organizationCampaignId,
        productId: item.productEngineId
          ? productsIds.find((product) => product.engineId === item.productEngineId).id
          : null,
      }));

      await prisma.organizationCampaignScore.createMany({ data: organizationCampaignScoreData });

      // Get created organizationCampaignScores from db
      const dbOrganizationCampaignScores = await prisma.organizationCampaignScore.findMany({
        where: { organizationCampaignId },
        select: { id: true, productId: true },
      });

      // For each organizationCampaignEcoscore...
      await Promise.all(
        organizationCampaign.ecoScores.map(async (organizationEcoScore) => {
          // Get organizationCampaignScoreId for current organizationEcoScore
          const productId = organizationEcoScore.productEngineId
            ? productsIds.find((item) => item.engineId === organizationEcoScore.productEngineId).id
            : null;

          const organizationCampaignScoreId = dbOrganizationCampaignScores.find(
            (item) => item.productId === productId,
          ).id;

          // Create kpiScores
          const kpiScoreData = organizationEcoScore.kpiEcoScores.map((item) => ({
            ecoScoreValue: item.ecoScoreValue,
            ecoScoreGrade: item.ecoScoreGrade as EcoScoreGrade,
            organizationCampaignScoreId,
            kpiId: kpiKeysAndIds.find((kpi) => kpi.key === item.kpiKey).id,
          }));

          await prisma.kpiScore.createMany({ data: kpiScoreData });
        }),
      );

      // ----- ESTABLISHMENT CAMPAIGNS ------
      // Create establishmentCampaigns
      const establishmentCampaignsData = organizationCampaign.establishmentCampaigns.map(
        (item) => ({
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          organizationCampaignId,
          establishmentId: establishmentsIds.find(
            (establishment) => establishment.engineId === item.establishmentEngineId,
          ).id,
        }),
      );

      await prisma.establishmentCampaign.createMany({ data: establishmentCampaignsData });

      // Get created establishmentCampaigns from db
      const dbEstablishmentCampaigns = await prisma.establishmentCampaign.findMany({
        where: { organizationCampaignId },
        select: { id: true, establishment: { select: { engineId: true } } },
      });

      // For each establishmentCampaign...
      await Promise.all(
        organizationCampaign.establishmentCampaigns.map(async (establishmentCampaign) => {
          // Get establishmentCampaignId for current establishmentCampaign from db
          const establishmentCampaignId = dbEstablishmentCampaigns.find(
            (item) => item.establishment.engineId === establishmentCampaign.establishmentEngineId,
          ).id;

          // Create productCampaigns
          const productCampaignsData = establishmentCampaign.productCampaigns.map((item) => ({
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            harvestedAmount: item.harvestedAmount,
            area: item.area,
            productId: productsIds.find((product) => product.engineId === item.productEngineId).id,
            establishmentCampaignId,
          }));

          await prisma.productCampaign.createMany({ data: productCampaignsData });

          // Get created productCampaigns from db
          const dbProductCampaigns = await prisma.productCampaign.findMany({
            where: { establishmentCampaignId },
            select: { id: true, product: { select: { engineId: true } } },
          });

          // For each productCampaign...
          await Promise.all(
            establishmentCampaign.productCampaigns.map(async (productCampaign) => {
              // Get productCampaignId for current productCampaign from db
              const productCampaignId = dbProductCampaigns.find(
                (item) => item.product.engineId === productCampaign.productEngineId,
              ).id;

              // Create productKpis
              const productKpiData = productCampaign.productKpis.map((item) => ({
                totalValue: item.totalValue,
                kpiId: kpiKeysAndIds.find((kpi) => kpi.key === item.kpiKey).id,
                productCampaignId,
              }));

              await prisma.productKpi.createMany({ data: productKpiData });

              // Get created productKpis from db
              const dbProductKpis = await prisma.productKpi.findMany({
                where: { productCampaignId },
                select: { id: true, kpi: { select: { key: true } } },
              });

              // For each productKpi...
              await Promise.all(
                productCampaign.productKpis.map(async (productKpi) => {
                  // Get productKpiId for current productKpi from db
                  const productKpiId = dbProductKpis.find(
                    (item) => item.kpi.key === productKpi.kpiKey,
                  ).id;

                  // Create electricity sources if productKpi has data
                  if (productKpi.electricitySources !== null) {
                    const electricitySources =
                      productKpi.electricitySources as ElectricitySourceData[];

                    const electricitySourcesData = electricitySources.map((item) => ({
                      productKpiId,
                      value: item.value,
                      electricitySourceId: electricitySourcesIds.find(
                        (source) => source.key === item.electricitySourceKey,
                      ).id,
                    }));

                    await prisma.productKpiElectricitySource.createMany({
                      data: electricitySourcesData,
                    });
                  }

                  // Create water composition data if productKpi has data
                  if (productKpi.waterComposition !== null) {
                    const waterComposition = {
                      ...productKpi.waterComposition,
                      productKpiId,
                    } as WaterComposition;

                    await prisma.waterComposition.create({
                      data: waterComposition,
                    });
                  }

                  // Create scopes data if productKpi has data
                  if (productKpi.scopes !== null) {
                    const scopes = { ...productKpi.scopes, productKpiId } as Scopes;

                    await prisma.scopes.create({
                      data: scopes,
                    });
                  }

                  // Create activityProductKpis
                  const activityProductKpiData = productKpi.activities.map((item) => ({
                    totalValue: item.totalValue,
                    activity: item.activity as Activity,
                    productKpiId,
                  }));

                  await prisma.activityProductKpi.createMany({ data: activityProductKpiData });

                  // Get created activityProductKpis from db
                  const dbActivityProductKpis = await prisma.activityProductKpi.findMany({
                    where: { productKpiId },
                    select: { id: true, activity: true },
                  });

                  // For each activityProductKpi...
                  productKpi.activities.map(async (activityProductKpi) => {
                    // Get activityProductKpiId for current activityProductKpi from db
                    const activityProductKpiId = dbActivityProductKpis.find(
                      (item) => item.activity === activityProductKpi.activity,
                    ).id;

                    // Create activityInputs
                    const activityInputsData = activityProductKpi.inputs.map((item) => ({
                      totalValue: item.totalValue,
                      upstream: item.upstream,
                      transportation: item.transportation,
                      core: item.core,
                      downstream: item.downstream,
                      activityId: activityProductKpiId,
                      inputId: inputsIds.find((input) => input.engineId === item.inputEngineId).id,
                    }));

                    await prisma.activityInput.createMany({
                      data: activityInputsData,
                    });
                  });
                }),
              );
            }),
          );
        }),
      );
    }),
  );
};
