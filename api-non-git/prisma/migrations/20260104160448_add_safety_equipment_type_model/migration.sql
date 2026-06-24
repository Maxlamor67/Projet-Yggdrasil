/*
  Warnings:

  - Added the required column `model` to the `SafetyEquipmentType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SafetyEquipmentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SafetyEquipmentType" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "SafetyEquipmentType";
DROP TABLE "SafetyEquipmentType";
ALTER TABLE "new_SafetyEquipmentType" RENAME TO "SafetyEquipmentType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
