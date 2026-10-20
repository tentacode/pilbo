CREATE TABLE `med_log` (
	`id` text PRIMARY KEY NOT NULL,
	`med_id` text NOT NULL,
	`taken_at` text NOT NULL,
	FOREIGN KEY (`med_id`) REFERENCES `med`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
ALTER TABLE `med` ADD `detail` text DEFAULT '' NOT NULL;