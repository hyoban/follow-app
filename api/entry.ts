import { isAfter } from 'date-fns'
import { eq, inArray } from 'drizzle-orm'
import { getDefaultStore } from 'jotai'

import type { TabViewIndex } from '~/atom/layout'
import { isLoadingAtom } from '~/atom/loading'
import { FETCH_PAGE_SIZE } from '~/consts/limit'
import { db } from '~/db'
import { entries } from '~/db/schema'

import { apiClient } from './client'
import { syncFeeds } from './feed'

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
  const store = getDefaultStore()
  store.set(isLoadingAtom, true)
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
  store.set(isLoadingAtom, false)
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

  await syncFeeds()
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
