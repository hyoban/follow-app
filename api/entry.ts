import { eq } from 'drizzle-orm'

import { db } from '~/db'
import { entries } from '~/db/schema'

import { apiClient } from './client'

type InferRequestType<T> = T extends (args: infer R, options: any | undefined) => Promise<unknown> ? NonNullable<R> : never
type GetEntriesProps = InferRequestType<typeof apiClient.entries.$post>['json']
export async function getEntries(
  props?: GetEntriesProps,
) {
  const entries = await apiClient.entries.$post({ json: { limit: 100, ...props } })
  return entries.data?.map(entry => ({
    ...entry,
    ...entry.entries,
    feedId: entry.feeds.id,
    read: entry.read ?? false,
  })) ?? []
}

export async function createOrUpdateEntriesInDB(
  props?: GetEntriesProps,
) {
  const entriesFromApi = await getEntries(props)
  for (const entry of entriesFromApi) {
    const entryInDB = await db.query.entries.findFirst({
      where: eq(entries.id, entry.id),
    })
    if (entryInDB) {
      await db.update(entries)
        .set(entry)
        .where(eq(entries.id, entry.id))
    }
    else {
      await db.insert(entries)
        .values(entry)
    }
  }
}
