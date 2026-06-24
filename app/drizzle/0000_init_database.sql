CREATE TABLE `Geometry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `GeometryPoint` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`geometryId` integer NOT NULL,
	`pointId` integer NOT NULL,
	`rank` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`geometryId`) REFERENCES `Geometry`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `GeometryPoint_pointId_unique` ON `GeometryPoint` (`pointId`);--> statement-breakpoint
CREATE TABLE `Point` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `PointToSecure` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` text NOT NULL,
	`pointId` integer NOT NULL,
	`safetyEquipmentTypeId` text,
	`comment` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`safetyEquipmentTypeId`) REFERENCES `SafetyEquipmentType`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PointToSecure_pointId_unique` ON `PointToSecure` (`pointId`);--> statement-breakpoint
CREATE TABLE `Project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `SafetyEquipmentTypeLength` (
	`id` text PRIMARY KEY NOT NULL,
	`safetyEquipmentTypeId` text NOT NULL,
	`length` real NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`safetyEquipmentTypeId`) REFERENCES `SafetyEquipmentType`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `SafetyEquipmentTypeLength_safetyEquipmentTypeId_length_unique` ON `SafetyEquipmentTypeLength` (`safetyEquipmentTypeId`,`length`);--> statement-breakpoint
CREATE TABLE `SafetyEquipmentType` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Schedule` (
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
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`safetyEquipmentTypeLengthId`) REFERENCES `SafetyEquipmentTypeLength`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Schedule_pointId_unique` ON `Schedule` (`pointId`);--> statement-breakpoint
CREATE TABLE `Team` (
	`id` text PRIMARY KEY NOT NULL,
	`projectId` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE no action ON DELETE no action
);
