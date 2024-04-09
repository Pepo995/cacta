-- CreateTable
CREATE TABLE "_KpiToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_KpiToUser_AB_unique" ON "_KpiToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_KpiToUser_B_index" ON "_KpiToUser"("B");

-- AddForeignKey
ALTER TABLE "_KpiToUser" ADD CONSTRAINT "_KpiToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Kpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KpiToUser" ADD CONSTRAINT "_KpiToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
