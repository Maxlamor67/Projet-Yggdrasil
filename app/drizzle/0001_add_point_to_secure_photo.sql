CREATE TABLE `PointToSecurePhoto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pointToSecureId` integer NOT NULL,
	`base64` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`pointToSecureId`) REFERENCES `PointToSecure`(`id`) ON UPDATE no action ON DELETE no action
);
