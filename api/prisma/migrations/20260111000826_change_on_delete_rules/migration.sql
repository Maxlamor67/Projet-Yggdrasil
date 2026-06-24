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
    CONSTRAINT "Action_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Action" ("createdAt", "id", "realizedAt", "safetyEquipmentId", "teamId", "type", "updatedAt") SELECT "createdAt", "id", "realizedAt", "safetyEquipmentId", "teamId", "type", "updatedAt" FROM "Action";
DROP TABLE "Action";
ALTER TABLE "new_Action" RENAME TO "Action";
CREATE UNIQUE INDEX "Action_safetyEquipmentId_type_key" ON "Action"("safetyEquipmentId", "type");
CREATE TABLE "new_PointToSecure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "safetyEquipmentTypeId" TEXT,
    "comment" TEXT,
    "isTreated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PointToSecure_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PointToSecure_safetyEquipmentTypeId_fkey" FOREIGN KEY ("safetyEquipmentTypeId") REFERENCES "SafetyEquipmentType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PointToSecure_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PointToSecure" ("comment", "createdAt", "id", "isTreated", "pointId", "projectId", "safetyEquipmentTypeId", "updatedAt") SELECT "comment", "createdAt", "id", "isTreated", "pointId", "projectId", "safetyEquipmentTypeId", "updatedAt" FROM "PointToSecure";
DROP TABLE "PointToSecure";
ALTER TABLE "new_PointToSecure" RENAME TO "PointToSecure";
CREATE UNIQUE INDEX "PointToSecure_pointId_key" ON "PointToSecure"("pointId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
