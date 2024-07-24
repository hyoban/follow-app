import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
