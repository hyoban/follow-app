CREATE TABLE `feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`description` text,
	`site_url` text,
	`image` text,
	`checked_at` text NOT NULL,
	`last_modified_header` text,
	`etag_header` text,
	`ttl` integer,
	`error_message` text,
	`error_at` text,
	`owner_user_id` text,
	`view` integer NOT NULL,
	`category` text,
	`is_private` integer DEFAULT false NOT NULL,
	`unread` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feeds_url_unique` ON `feeds` (`url`);