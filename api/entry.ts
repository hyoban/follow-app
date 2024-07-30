import { eq } from 'drizzle-orm'

import { db } from '~/db'
import type { Feed } from '~/db/schema'
import { entries, feeds } from '~/db/schema'

import { apiClient } from './client'

type InferRequestType<T> = T extends (args: infer R, options: any | undefined) => Promise<unknown> ? NonNullable<R> : never
type GetEntriesProps = InferRequestType<typeof apiClient.entries.$post>['json']
export async function getEntries(
  props?: GetEntriesProps,
) {
  const entries = await apiClient.entries.$post({ json: { ...props } })
  return entries.data?.map(entry => ({
    ...entry,
    ...entry.entries,
    feedId: entry.feeds.id,
    read: entry.read ?? false,
  })) ?? []
}

export async function createOrUpdateEntriesInDB(
  entryList: Array<Awaited<ReturnType<typeof getEntries>>[0]>,
) {
  if (entryList.length === 0) {
    return
  }
  return await Promise.all(entryList.map(async (entry) => {
    const entryInDB = await db.query.entries.findFirst({
      where: eq(entries.id, entry.id),
    })
    if (entryInDB) {
      let isSame = true
      for (const key of Object.keys(entryInDB)) {
        if (entryInDB[key as keyof typeof entryInDB] !== entry[key as keyof typeof entry]) {
          isSame = false
          break
        }
      }

      if (!isSame) {
        await db.update(entries)
          .set(entry)
          .where(eq(entries.id, entry.id))
      }
    }
    else {
      await db.insert(entries)
        .values(entry)
    }
  }))
}

export async function fetchAndUpdateEntriesInDB(
  props?: GetEntriesProps,
) {
  const entriesFromApi = await getEntries(props)
  return await createOrUpdateEntriesInDB(entriesFromApi)
}

export async function markEntryAsRead(
  entryId: string,
  feed: Feed,
) {
  return await Promise.all(
    [
      db.update(entries)
        .set({
          read: true,
        })
        .where(eq(entries.id, entryId)),
      db.update(feeds)
        .set({
          unread: feed.unread > 0 ? feed.unread - 1 : 0,
        })
        .where(eq(feeds.id, feed.id)),
      apiClient.reads.$post({
        json: {
          entryIds: [entryId],
        },
      }),
    ],
  )
}

export async function loadEntryContent(
  entryId: string,
) {
  const res = await apiClient.entries
    .$get({ query: { id: entryId } })
  return await db.update(entries)
    .set({ content: res.data?.entries.content })
    .where(eq(entries.id, entryId))
}
