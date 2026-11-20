ALTER TABLE `intake` ADD `frequency` text DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE `intake` ADD `interval` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `intake` ADD `starts_on` text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE `intake` SET `starts_on` = `created_on`;
