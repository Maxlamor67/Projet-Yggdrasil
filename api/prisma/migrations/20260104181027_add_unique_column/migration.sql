/*
  Warnings:

  - A unique constraint covering the columns `[safetyEquipmentTypeId,length]` on the table `SafetyEquipmentTypeLength` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SafetyEquipmentTypeLength_safetyEquipmentTypeId_length_key" ON "SafetyEquipmentTypeLength"("safetyEquipmentTypeId", "length");
