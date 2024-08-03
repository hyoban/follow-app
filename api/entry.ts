import { isAfter } from 'date-fns'
import { eq, inArray } from 'drizzle-orm'

import { FETCH_PAGE_SIZE } from '~/consts/limit'
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

  const entryListInDb = await db.query.entries.findMany({
    where: inArray(entries.id, entryList.map(entry => entry.id)),
  })
  const entryListToUpdate = entryList
    .filter((entry) => {
      const entryInDB = entryListInDb.find(entryInDB => entryInDB.id === entry.id)
      if (!entryInDB)
        return false

      let isSame = true
      for (const key of Object.keys(entryInDB)) {
        if (key !== 'read') {
          continue
        }

        if (entryInDB[key as keyof typeof entryInDB] !== entry[key as keyof typeof entry]) {
          isSame = false
          console.info('different key', key, entryInDB[key as keyof typeof entryInDB], entry[key as keyof typeof entry])
          break
        }
      }
      return !isSame
    })
  console.info('entryListToUpdate', entryListToUpdate.length)
  await Promise.all(
    entryListToUpdate.map(
      entry => db.update(entries)
        .set(entry)
        .where(eq(entries.id, entry.id)),
    ),
  )

  const entryListToCreate = entryList
    .filter(entry => !entryListInDb.find(entryInDB => entryInDB.id === entry.id))
  console.info('entryListToCreate', entryListToCreate.length)
  if (entryListToCreate.length > 0) {
    await db.insert(entries)
      .values(entryListToCreate)
  }
}

export async function checkNotExistEntries(
  feedIdList: string[],
  end?: string,
  start?: string,
) {
  console.info('checkNotExistEntries', feedIdList.length, start, end)
  let entriesFromApi = await getEntries({ feedIdList, publishedAfter: start, limit: FETCH_PAGE_SIZE })
  await createOrUpdateEntriesInDB(entriesFromApi)
  while (
    entriesFromApi.length > 0
    && entriesFromApi.at(-1)?.publishedAt
    && end
    && isAfter(new Date(entriesFromApi.at(-1)!.publishedAt!), new Date(end))
  ) {
    const publishedAfter = entriesFromApi.at(-1)?.publishedAt
    entriesFromApi = await getEntries({ feedIdList, publishedAfter, limit: FETCH_PAGE_SIZE })
    await createOrUpdateEntriesInDB(entriesFromApi)
  }
  console.info('checkNotExistEntries done')
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
