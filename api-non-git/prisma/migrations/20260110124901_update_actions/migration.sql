/*
  Warnings:

  - You are about to drop the column `setAt` on the `SafetyEquipment` table. All the data in the column will be lost.
  - You are about to drop the column `unsetAt` on the `SafetyEquipment` table. All the data in the column will be lost.
  - Added the required column `realizedAt` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Action" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "safetyEquipmentId" TEXT NOT NULL,
    "teamId" TEXT,
    "type" TEXT NOT NULL,
    "realizedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Action_safetyEquipmentId_fkey" FOREIGN KEY ("safetyEquipmentId") REFERENCES "SafetyEquipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Action_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Action" ("createdAt", "id", "safetyEquipmentId", "teamId", "type", "updatedAt") SELECT "createdAt", "id", "safetyEquipmentId", "teamId", "type", "updatedAt" FROM "Action";
DROP TABLE "Action";
ALTER TABLE "new_Action" RENAME TO "Action";
CREATE UNIQUE INDEX "Action_safetyEquipmentId_type_key" ON "Action"("safetyEquipmentId", "type");
CREATE TABLE "new_SafetyEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "safetyEquipmentTypeLengthId" TEXT NOT NULL,
    "safetyEquipmentTypeLengthCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SafetyEquipment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SafetyEquipment_safetyEquipmentTypeLengthId_fkey" FOREIGN KEY ("safetyEquipmentTypeLengthId") REFERENCES "SafetyEquipmentTypeLength" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SafetyEquipment" ("createdAt", "id", "projectId", "safetyEquipmentTypeLengthCount", "safetyEquipmentTypeLengthId", "updatedAt") SELECT "createdAt", "id", "projectId", "safetyEquipmentTypeLengthCount", "safetyEquipmentTypeLengthId", "updatedAt" FROM "SafetyEquipment";
DROP TABLE "SafetyEquipment";
ALTER TABLE "new_SafetyEquipment" RENAME TO "SafetyEquipment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
