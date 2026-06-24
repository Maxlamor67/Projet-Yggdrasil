-- CreateTable
CREATE TABLE "AttentionPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AttentionPoint_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttentionPoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AttentionPoint_pointId_key" ON "AttentionPoint"("pointId");
