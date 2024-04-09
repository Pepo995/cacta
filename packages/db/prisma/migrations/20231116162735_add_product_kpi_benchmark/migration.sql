-- CreateTable
CREATE TABLE "ProductKpiBenchmark" (
    "id" TEXT NOT NULL,
    "benchmark" DOUBLE PRECISION NOT NULL,
    "organizationCampaignKpiBenchmarkId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductKpiBenchmark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductKpiBenchmark" ADD CONSTRAINT "ProductKpiBenchmark_organizationCampaignKpiBenchmarkId_fkey" FOREIGN KEY ("organizationCampaignKpiBenchmarkId") REFERENCES "OrganizationCampaignKpiBenchmark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpiBenchmark" ADD CONSTRAINT "ProductKpiBenchmark_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
