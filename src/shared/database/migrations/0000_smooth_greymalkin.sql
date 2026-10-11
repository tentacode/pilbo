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
	`reminder_interval_minutes` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `med` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`strength` text NOT NULL,
	`design` text NOT NULL,
	`is_as_needed` integer DEFAULT false NOT NULL
);
