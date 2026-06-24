-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SafetyEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "safetyEquipmentTypeLengthId" TEXT NOT NULL,
    "safetyEquipmentTypeLengthCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SafetyEquipment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SafetyEquipment_safetyEquipmentTypeLengthId_fkey" FOREIGN KEY ("safetyEquipmentTypeLengthId") REFERENCES "SafetyEquipmentTypeLength" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SafetyEquipment" ("createdAt", "id", "projectId", "safetyEquipmentTypeLengthCount", "safetyEquipmentTypeLengthId", "updatedAt") SELECT "createdAt", "id", "projectId", "safetyEquipmentTypeLengthCount", "safetyEquipmentTypeLengthId", "updatedAt" FROM "SafetyEquipment";
DROP TABLE "SafetyEquipment";
ALTER TABLE "new_SafetyEquipment" RENAME TO "SafetyEquipment";
CREATE TABLE "new_SafetyEquipmentTypeLength" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "safetyEquipmentTypeId" TEXT NOT NULL,
    "length" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SafetyEquipmentTypeLength_safetyEquipmentTypeId_fkey" FOREIGN KEY ("safetyEquipmentTypeId") REFERENCES "SafetyEquipmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SafetyEquipmentTypeLength" ("createdAt", "id", "length", "safetyEquipmentTypeId") SELECT "createdAt", "id", "length", "safetyEquipmentTypeId" FROM "SafetyEquipmentTypeLength";
DROP TABLE "SafetyEquipmentTypeLength";
ALTER TABLE "new_SafetyEquipmentTypeLength" RENAME TO "SafetyEquipmentTypeLength";
CREATE UNIQUE INDEX "SafetyEquipmentTypeLength_safetyEquipmentTypeId_length_key" ON "SafetyEquipmentTypeLength"("safetyEquipmentTypeId", "length");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
