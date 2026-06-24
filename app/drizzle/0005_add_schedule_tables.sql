CREATE TABLE `SchedulePointPointer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `SchedulePoint` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`schedulePointPointerId` integer NOT NULL,
	`pointId` integer NOT NULL,
	`rank` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`schedulePointPointerId`) REFERENCES `SchedulePointPointer`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`pointId`) REFERENCES `Point`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `SchedulePoint_pointId_unique` ON `SchedulePoint` (`pointId`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`projectId` text NOT NULL,
	`safetyEquipmentTypeLengthId` text NOT NULL,
	`schedulePointPointerId` integer NOT NULL,
	`quantity` text NOT NULL,
	`actionType` text NOT NULL,
	`actionAt` text NOT NULL,
	`isTreated` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`safetyEquipmentTypeLengthId`) REFERENCES `SafetyEquipmentTypeLength`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`schedulePointPointerId`) REFERENCES `SchedulePointPointer`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Schedule`("id", "projectId", "safetyEquipmentTypeLengthId", "schedulePointPointerId", "quantity", "actionType", "actionAt", "isTreated", "createdAt") SELECT "id", "projectId", "safetyEquipmentTypeLengthId", "schedulePointPointerId", "quantity", "actionType", "actionAt", "isTreated", "createdAt" FROM `Schedule`;--> statement-breakpoint
DROP TABLE `Schedule`;--> statement-breakpoint
ALTER TABLE `__new_Schedule` RENAME TO `Schedule`;--> statement-breakpoint
PRAGMA foreign_keys=ON;