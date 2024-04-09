import { ElectricitySourceKey, Kpi, KpiCategory, KpiKey, PrismaClient } from "@prisma/client";

import electricitySourcesData from "../data/electricitySource.json";
import kpisData from "../data/kpis.json";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.adminUser.create({
    data: {
      name: "Cacta Admin",
      email: "cacta@admin.com",
      hashedPassword: "$2a$12$dY5knbc4hhg/Qjg1IuHAbO4sWGfJezfRDEyka6XimT1kS1xa/1xay",
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

  await prisma.electricitySource.createMany({
    data: electricitySourcesData.map((item) => ({
      ...item,
      key: item.key as ElectricitySourceKey,
    })),
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
