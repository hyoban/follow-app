import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').notNull().primaryKey(),
  email: text('email'),
  name: text('name'),
  handle: text('handle'),
  image: text('image'),
  createdAt: text('created_at'),
  expires: text('expires'),
  sessionToken: text('session_token'),
})

export const feeds = sqliteTable('feeds', {
  id: text('id').primaryKey(),
  url: text('url').notNull().unique(),

  title: text('title'),
  description: text('description'),
  siteUrl: text('site_url'),
  image: text('image'),

  // date
  checkedAt: text('checked_at').notNull(),
  lastModifiedHeader: text('last_modified_header'),
  etagHeader: text('etag_header'),
  ttl: integer('ttl'),

  errorMessage: text('error_message'),
  // date
  errorAt: text('error_at'),

  ownerUserId: text('owner_user_id'),

  view: integer('view').notNull(),
  category: text('category'),
  isPrivate: integer('is_private', { mode: 'boolean' }).notNull().default(false),

  unread: integer('unread').notNull().default(0),
})

export type Feed = typeof feeds.$inferSelect
