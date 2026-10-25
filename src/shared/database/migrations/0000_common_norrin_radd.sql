CREATE TABLE `intake_log` (
	`id` text PRIMARY KEY NOT NULL,
	`intake_id` text NOT NULL,
	`expected_intake_at` text NOT NULL,
	`created_at` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`intake_id`) REFERENCES `intake`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `intake_med` (
	`intake_id` text NOT NULL,
	`med_id` text NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`intake_id`, `med_id`),
	FOREIGN KEY (`intake_id`) REFERENCES `intake`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`med_id`) REFERENCES `med`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `intake` (
	`id` text PRIMARY KEY NOT NULL,
	`hour` integer NOT NULL,
	`minute` integer NOT NULL,
	`days` text NOT NULL,
	`reminder_interval_minutes` integer NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`created_on` text NOT NULL,
	`archived_on` text
);
--> statement-breakpoint
CREATE TABLE `med_log` (
	`id` text PRIMARY KEY NOT NULL,
	`med_id` text NOT NULL,
	`taken_at` text NOT NULL,
	FOREIGN KEY (`med_id`) REFERENCES `med`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `med` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`strength` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`design` text NOT NULL,
	`is_as_needed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stock` (
	`med_id` text PRIMARY KEY NOT NULL,
	`quantity` integer NOT NULL,
	`box_size` integer NOT NULL,
	`low_stock_days` integer NOT NULL,
	FOREIGN KEY (`med_id`) REFERENCES `med`(`id`) ON UPDATE no action ON DELETE cascade
);
