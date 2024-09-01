import { isBefore, subMinutes } from 'date-fns'
import { and, eq, inArray, sql } from 'drizzle-orm'
import type { InferRequestType } from 'hono/client'
import { getDefaultStore } from 'jotai'

import { FETCH_PAGE_SIZE } from '~/consts/limit'
import { db } from '~/db'
import { entries, feeds } from '~/db/schema'
import { showUnreadOnlyAtom } from '~/store/entry'
import type { TabViewIndex } from '~/store/layout'

import { apiClient } from './client'

type GetEntriesProps = InferRequestType<typeof apiClient.entries.$post>['json']
export async function getEntries(
  props?: GetEntriesProps,
) {
  const entries = await (await apiClient.entries.$post({ json: { ...props } })).json()
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

export async function checkNotExistEntries({
  feedIdList,
  start,
  end,
}: {
  feedIdList: string[]
  start?: string
  end?: string
}) {
  const store = getDefaultStore()

  const readOnly = store.get(showUnreadOnlyAtom)
  console.info('checkNotExistEntries', feedIdList.length, start, end, readOnly)
  let entriesFromApi = await getEntries({
    feedIdList,
    publishedAfter: start,
    read: readOnly ? false : undefined,
    limit: FETCH_PAGE_SIZE,
  })
  if (end && entriesFromApi.at(-1)?.publishedAt) {
    while (isBefore(subMinutes(end, 1), entriesFromApi.at(-1)!.publishedAt)) {
      console.info('fetch next page', entriesFromApi.at(-1)!.publishedAt)
      const newEntries = await getEntries({
        feedIdList,
        publishedAfter: entriesFromApi.at(-1)!.publishedAt,
        read: readOnly ? false : undefined,
        limit: FETCH_PAGE_SIZE,
      })
      if (newEntries.length === 0) {
        break
      }
      entriesFromApi = entriesFromApi.concat(newEntries)
    }
  }
  console.info('entriesFromApi', entriesFromApi.length)
  await createOrUpdateEntriesInDB(entriesFromApi)

  return entriesFromApi.at(-1)?.publishedAt
}

export async function fetchAndUpdateEntriesInDB(
  props?: GetEntriesProps,
) {
  const entriesFromApi = await getEntries(props)
  return await createOrUpdateEntriesInDB(entriesFromApi)
}

function toArray(value: string | string[]) {
  return Array.isArray(value) ? value : [value]
}

export async function flagEntryReadStatus({
  entryId,
  feedId,
  view,
  read = true,
}: {
  entryId?: string | string[]
  feedId?: string | string[]
  view?: TabViewIndex
  read?: boolean
}) {
  const feedIdList = toArray(feedId ?? [])
  const entryIdList = toArray(entryId ?? [])
  if (feedIdList.length === 0 && entryIdList.length === 0 && view === undefined) {
    return
  }

  // handle change in local db
  if (view !== undefined) {
    const entryListToUpdate = await db.select()
      .from(entries)
      .leftJoin(feeds, eq(entries.feedId, feeds.id))
      .where(and(eq(feeds.view, view), eq(entries.read, false)))
    const entryIdListToUpdate = entryListToUpdate.map(entry => entry.entries.id)

    await db.update(entries)
      .set({ read })
      .where(inArray(entries.id, entryIdListToUpdate))
    await db.update(feeds)
      .set({ unread: 0 })
      .where(eq(feeds.view, view))
  }
  else if (entryIdList.length > 0) {
    await db.update(entries)
      .set({ read })
      .where(inArray(entries.id, entryIdList))

    const feedListToUpdate = (await db.select()
      .from(entries)
      .where(inArray(entries.id, entryIdList)))
      .map(entry => entry.feedId)
    await Promise.all(
      feedListToUpdate.map(feedId => db.update(feeds)
        .set({ unread: read ? sql`${feeds.unread} - 1` : sql`${feeds.unread} + 1` })
        .where(eq(feeds.id, feedId)),
      ),
    )
  }
  else if (feedIdList.length > 0) {
    await db.update(entries)
      .set({ read })
      .where(inArray(entries.feedId, feedIdList))

    await db.update(feeds)
      .set({ unread: 0 })
      .where(inArray(feeds.id, feedIdList))
  }

  await Promise.all(
    [
      entryIdList.length > 0
        ? read
          ? apiClient.reads.$post({
            json: {
              entryIds: entryIdList,
            },
          })
          : entryIdList.map(entryId => apiClient.reads.$delete({
            json: {
              entryId,
            },
          }))
        : apiClient.reads.all.$post({
          json: view !== undefined ? { view } : { feedIdList },
        }),
    ].flat(),
  )
}

export async function loadEntryContent(
  entryId: string,
) {
  const res = await (await apiClient.entries.$get({ query: { id: entryId } })).json()
  return await db.update(entries)
    .set({ content: res.data?.entries.content })
    .where(eq(entries.id, entryId))
}
