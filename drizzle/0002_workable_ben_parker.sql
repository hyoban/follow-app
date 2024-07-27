CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_id` text NOT NULL,
	`title` text,
	`url` text,
	`content` text,
	`description` text,
	`guid` text NOT NULL,
	`author` text,
	`author_url` text,
	`author_avatar` text,
	`inserted_at` text NOT NULL,
	`published_at` text NOT NULL,
	`media` text,
	`categories` text,
	`attachments` text,
	`read` integer NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `feeds`(`id`) ON UPDATE no action ON DELETE cascade
);
