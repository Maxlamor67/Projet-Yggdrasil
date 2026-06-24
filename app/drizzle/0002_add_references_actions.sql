PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Geometry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Geometry`("id", "projectId", "name", "type", "createdAt") SELECT "id", "projectId", "name", "type", "createdAt" FROM `Geometry`;--> statement-breakpoint
DROP TABLE `Geometry`;--> statement-breakpoint
ALTER TABLE `__new_Geometry` RENAME TO `Geometry`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_GeometryPoint` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`geometryId` integer NOT NULL,
	`pointId` integer NOT NULL,
	`rank` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`geometryId`) REFERENCES `Geometry`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_GeometryPoint`("id", "geometryId", "pointId", "rank", "createdAt") SELECT "id", "geometryId", "pointId", "rank", "createdAt" FROM `GeometryPoint`;--> statement-breakpoint
DROP TABLE `GeometryPoint`;--> statement-breakpoint
ALTER TABLE `__new_GeometryPoint` RENAME TO `GeometryPoint`;--> statement-breakpoint
CREATE UNIQUE INDEX `GeometryPoint_pointId_unique` ON `GeometryPoint` (`pointId`);--> statement-breakpoint
CREATE TABLE `__new_PointToSecurePhoto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pointToSecureId` integer NOT NULL,
	`base64` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`pointToSecureId`) REFERENCES `PointToSecure`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_PointToSecurePhoto`("id", "pointToSecureId", "base64", "createdAt") SELECT "id", "pointToSecureId", "base64", "createdAt" FROM `PointToSecurePhoto`;--> statement-breakpoint
DROP TABLE `PointToSecurePhoto`;--> statement-breakpoint
ALTER TABLE `__new_PointToSecurePhoto` RENAME TO `PointToSecurePhoto`;--> statement-breakpoint
CREATE TABLE `__new_PointToSecure` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` text NOT NULL,
	`pointId` integer NOT NULL,
	`safetyEquipmentTypeId` text,
	`comment` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`safetyEquipmentTypeId`) REFERENCES `SafetyEquipmentType`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_PointToSecure`("id", "projectId", "pointId", "safetyEquipmentTypeId", "comment", "createdAt", "updatedAt") SELECT "id", "projectId", "pointId", "safetyEquipmentTypeId", "comment", "createdAt", "updatedAt" FROM `PointToSecure`;--> statement-breakpoint
DROP TABLE `PointToSecure`;--> statement-breakpoint
ALTER TABLE `__new_PointToSecure` RENAME TO `PointToSecure`;--> statement-breakpoint
CREATE UNIQUE INDEX `PointToSecure_pointId_unique` ON `PointToSecure` (`pointId`);--> statement-breakpoint
CREATE TABLE `__new_SafetyEquipmentTypeLength` (
	`id` text PRIMARY KEY NOT NULL,
	`safetyEquipmentTypeId` text NOT NULL,
	`length` real NOT NULL,
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
	`quantity` integer NOT NULL,
	`actionType` text NOT NULL,
	`actionAt` text NOT NULL,
	`isTreated` integer DEFAULT 0 NOT NULL,
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
CREATE UNIQUE INDEX `Schedule_pointId_unique` ON `Schedule` (`pointId`);--> statement-breakpoint
CREATE TABLE `__new_Team` (
	`id` text PRIMARY KEY NOT NULL,
	`projectId` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Team`("id", "projectId", "name", "createdAt") SELECT "id", "projectId", "name", "createdAt" FROM `Team`;--> statement-breakpoint
DROP TABLE `Team`;--> statement-breakpoint
ALTER TABLE `__new_Team` RENAME TO `Team`;