PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_GeometryPoint` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`geometryId` integer NOT NULL,
	`pointId` integer NOT NULL,
	`rank` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`geometryId`) REFERENCES `Geometry`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_GeometryPoint`("id", "geometryId", "pointId", "rank", "createdAt") SELECT "id", "geometryId", "pointId", "rank", "createdAt" FROM `GeometryPoint`;--> statement-breakpoint
DROP TABLE `GeometryPoint`;--> statement-breakpoint
ALTER TABLE `__new_GeometryPoint` RENAME TO `GeometryPoint`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `GeometryPoint_pointId_unique` ON `GeometryPoint` (`pointId`);--> statement-breakpoint
CREATE TABLE `__new_Point` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_Point`("id", "latitude", "longitude", "createdAt", "updatedAt") SELECT "id", "latitude", "longitude", "createdAt", "updatedAt" FROM `Point`;--> statement-breakpoint
DROP TABLE `Point`;--> statement-breakpoint
ALTER TABLE `__new_Point` RENAME TO `Point`;--> statement-breakpoint
CREATE TABLE `__new_SafetyEquipmentTypeLength` (
	`id` text PRIMARY KEY NOT NULL,
	`safetyEquipmentTypeId` text NOT NULL,
	`length` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`safetyEquipmentTypeId`) REFERENCES `SafetyEquipmentType`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_SafetyEquipmentTypeLength`("id", "safetyEquipmentTypeId", "length", "createdAt") SELECT "id", "safetyEquipmentTypeId", "length", "createdAt" FROM `SafetyEquipmentTypeLength`;--> statement-breakpoint
DROP TABLE `SafetyEquipmentTypeLength`;--> statement-breakpoint
ALTER TABLE `__new_SafetyEquipmentTypeLength` RENAME TO `SafetyEquipmentTypeLength`;--> statement-breakpoint
CREATE UNIQUE INDEX `SafetyEquipmentTypeLength_safetyEquipmentTypeId_length_unique` ON `SafetyEquipmentTypeLength` (`safetyEquipmentTypeId`,`length`);--> statement-breakpoint
CREATE TABLE `__new_Schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`projectId` text NOT NULL,
	`safetyEquipmentTypeLengthId` text NOT NULL,
	`pointId` integer NOT NULL,
	`teamId` text NOT NULL,
	`quantity` text NOT NULL,
	`actionType` text NOT NULL,
	`actionAt` text NOT NULL,
	`isTreated` text DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`safetyEquipmentTypeLengthId`) REFERENCES `SafetyEquipmentTypeLength`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Schedule`("id", "projectId", "safetyEquipmentTypeLengthId", "pointId", "teamId", "quantity", "actionType", "actionAt", "isTreated", "createdAt") SELECT "id", "projectId", "safetyEquipmentTypeLengthId", "pointId", "teamId", "quantity", "actionType", "actionAt", "isTreated", "createdAt" FROM `Schedule`;--> statement-breakpoint
DROP TABLE `Schedule`;--> statement-breakpoint
ALTER TABLE `__new_Schedule` RENAME TO `Schedule`;--> statement-breakpoint
CREATE UNIQUE INDEX `Schedule_pointId_unique` ON `Schedule` (`pointId`);