PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_PointToSecurePhoto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pointToSecureId` integer NOT NULL,
	`mimeType` text NOT NULL,
	`data` blob NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`pointToSecureId`) REFERENCES `PointToSecure`(`id`) ON UPDATE restrict ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_PointToSecurePhoto`("id", "pointToSecureId", "mimeType", "data", "createdAt") SELECT "id", "pointToSecureId", "mimeType", "data", "createdAt" FROM `PointToSecurePhoto`;--> statement-breakpoint
DROP TABLE `PointToSecurePhoto`;--> statement-breakpoint
ALTER TABLE `__new_PointToSecurePhoto` RENAME TO `PointToSecurePhoto`;--> statement-breakpoint
PRAGMA foreign_keys=ON;