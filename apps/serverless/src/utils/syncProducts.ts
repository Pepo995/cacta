import prisma from "@cacta/db";

import { OrganizationsAndProducts } from "./types";

export const syncProducts = async (organizationsAndProducts: OrganizationsAndProducts) => {
  // Delete product
  const deletedProductsEngineIds = organizationsAndProducts.products
    .filter((product) => !!product.deletedAt)
    .map((product) => product.engineId);

  await prisma.product.deleteMany({
    where: { engineId: { in: deletedProductsEngineIds } },
  });

  // Create and update product
  const syncProducts = organizationsAndProducts.products.filter((product) => !product.deletedAt);

  const products = syncProducts.map((product) => {
    const { deletedAt, ...rest } = product;

    return {
      ...rest,
      name: { es: product.engineName, en: product.engineName },
    };
  });

  await prisma.$transaction(
    products.map((producData) =>
      prisma.product.upsert({
        where: { engineId: producData.engineId },
        update: producData,
        create: producData,
      }),
    ),
  );
};
