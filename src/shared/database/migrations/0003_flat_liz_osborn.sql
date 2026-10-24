CREATE TABLE `stock` (
	`med_id` text PRIMARY KEY NOT NULL,
	`quantity` integer NOT NULL,
	`box_size` integer NOT NULL,
	`low_stock_days` integer NOT NULL,
	FOREIGN KEY (`med_id`) REFERENCES `med`(`id`) ON UPDATE no action ON DELETE cascade
);
