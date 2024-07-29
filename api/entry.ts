import { eq } from 'drizzle-orm'

import { db } from '~/db'
import { entries } from '~/db/schema'

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
  return Promise.all(entryList.map(async (entry) => {
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
  return createOrUpdateEntriesInDB(entriesFromApi)
}
