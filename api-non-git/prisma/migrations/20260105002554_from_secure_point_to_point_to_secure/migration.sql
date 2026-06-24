/*
  Warnings:

  - You are about to drop the `SecurePoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `securePointId` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `pointToSecureId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SecurePoint_pointId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SecurePoint";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PointToSecure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "safetyEquipmentTypeId" TEXT,
    "comment" TEXT,
    "isTreated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PointToSecure_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PointToSecure_safetyEquipmentTypeId_fkey" FOREIGN KEY ("safetyEquipmentTypeId") REFERENCES "SafetyEquipmentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PointToSecure_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pointToSecureId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_pointToSecureId_fkey" FOREIGN KEY ("pointToSecureId") REFERENCES "PointToSecure" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("createdAt", "data", "id", "mimeType") SELECT "createdAt", "data", "id", "mimeType" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PointToSecure_pointId_key" ON "PointToSecure"("pointId");
