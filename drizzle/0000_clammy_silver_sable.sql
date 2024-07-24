CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`handle` text,
	`image` text,
	`created_at` text,
	`expires` text,
	`session_token` text
);
