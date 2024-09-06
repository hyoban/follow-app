import { relations } from 'drizzle-orm'
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

export type User = typeof users.$inferSelect

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

export const feedsRelations = relations(users, ({ many }) => ({
  entries: many(entries),
}))

export type MediaModel = {
  url: string
  type: 'photo' | 'video'
  preview_image_url?: string
  width?: number
  height?: number
}

export type AttachmentsModel = {
  url: string
  duration_in_seconds?: number
  mime_type?: string
  size_in_bytes?: number
  title?: string
}

export const entries = sqliteTable(
  'entries',
  {
    id: text('id').primaryKey(),
    feedId: text('feed_id')
      .notNull()
      .references(() => feeds.id, {
        onDelete: 'cascade',
      }),

    title: text('title'),
    url: text('url'),
    content: text('content'),
    description: text('description'),
    guid: text('guid').notNull(),
    author: text('author'),
    authorUrl: text('author_url'),
    authorAvatar: text('author_avatar'),
    // date
    insertedAt: text('inserted_at').notNull(),
    // date
    publishedAt: text('published_at').notNull(),
    media: text('media', { mode: 'json' })
      .$type<MediaModel[]>(),
    categories: text('categories', { mode: 'json' }).$type<string[]>(),
    attachments: text('attachments', { mode: 'json' })
      .$type<AttachmentsModel[]>(),

    read: integer('read', { mode: 'boolean' }).notNull(),
    collections: text('collections'),
  },
)

export type Entry = typeof entries.$inferSelect

export const entriesRelations = relations(entries, ({ one }) => ({
  feed: one(feeds, { fields: [entries.feedId], references: [feeds.id] }),
}))
