/*
  Warnings:

  - You are about to drop the `InterestPoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `geometryId` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transfer` table. All the data in the column will be lost.
  - Added the required column `name` to the `Geometry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ProjectToTeam_B_index";

-- DropIndex
DROP INDEX "_ProjectToTeam_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InterestPoint";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProjectToTeam";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "safetyEquipmentId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Action_safetyEquipmentId_fkey" FOREIGN KEY ("safetyEquipmentId") REFERENCES "SafetyEquipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Action_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GeometryPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "geometryId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GeometryPoint_geometryId_fkey" FOREIGN KEY ("geometryId") REFERENCES "Geometry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GeometryPoint_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "securePointId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_securePointId_fkey" FOREIGN KEY ("securePointId") REFERENCES "SecurePoint" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "geometryId" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "slowerParticipantSpeedEstimate" REAL NOT NULL,
    "fasterParticipantSpeedEstimate" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Route_geometryId_fkey" FOREIGN KEY ("geometryId") REFERENCES "Geometry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SafetyEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "safetyEquipmentTypeLengthId" TEXT NOT NULL,
    "safetyEquipmentTypeLengthCount" INTEGER NOT NULL,
    "setAt" DATETIME,
    "unsetAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SafetyEquipment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SafetyEquipment_safetyEquipmentTypeLengthId_fkey" FOREIGN KEY ("safetyEquipmentTypeLengthId") REFERENCES "SafetyEquipmentTypeLength" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SafetyEquipmentPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "safetyEquipmentId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SafetyEquipmentPoint_safetyEquipmentId_fkey" FOREIGN KEY ("safetyEquipmentId") REFERENCES "SafetyEquipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SafetyEquipmentPoint_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SafetyEquipmentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SafetyEquipmentTypeLength" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "safetyEquipmentTypeId" TEXT NOT NULL,
    "length" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SafetyEquipmentTypeLength_safetyEquipmentTypeId_fkey" FOREIGN KEY ("safetyEquipmentTypeId") REFERENCES "SafetyEquipmentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SecurePoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "safetyEquipmentTypeId" TEXT,
    "comment" TEXT,
    "isTreated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SecurePoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SecurePoint_safetyEquipmentTypeId_fkey" FOREIGN KEY ("safetyEquipmentTypeId") REFERENCES "SafetyEquipmentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SecurePoint_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Geometry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Geometry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Geometry" ("createdAt", "id", "projectId", "type", "updatedAt") SELECT "createdAt", "id", "projectId", "type", "updatedAt" FROM "Geometry";
DROP TABLE "Geometry";
ALTER TABLE "new_Geometry" RENAME TO "Geometry";
CREATE TABLE "new_Point" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Point" ("createdAt", "id", "latitude", "longitude", "updatedAt") SELECT "createdAt", "id", "latitude", "longitude", "updatedAt" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startAtDate" DATETIME,
    "endAtDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Team_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE TABLE "new_Transfer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transfer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transfer" ("createdAt", "id", "projectId", "type") SELECT "createdAt", "id", "projectId", "type" FROM "Transfer";
DROP TABLE "Transfer";
ALTER TABLE "new_Transfer" RENAME TO "Transfer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Action_safetyEquipmentId_type_key" ON "Action"("safetyEquipmentId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "GeometryPoint_pointId_key" ON "GeometryPoint"("pointId");

-- CreateIndex
CREATE UNIQUE INDEX "GeometryPoint_geometryId_rank_key" ON "GeometryPoint"("geometryId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "Route_geometryId_key" ON "Route"("geometryId");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyEquipmentPoint_pointId_key" ON "SafetyEquipmentPoint"("pointId");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyEquipmentPoint_safetyEquipmentId_rank_key" ON "SafetyEquipmentPoint"("safetyEquipmentId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "SecurePoint_pointId_key" ON "SecurePoint"("pointId");
