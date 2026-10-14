CREATE TABLE `intake_log` (
	`id` text PRIMARY KEY NOT NULL,
	`intake_id` text NOT NULL,
	`expected_intake_at` text NOT NULL,
	`created_at` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`intake_id`) REFERENCES `intake`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
ALTER TABLE `intake` ADD `is_archived` integer DEFAULT false NOT NULL;