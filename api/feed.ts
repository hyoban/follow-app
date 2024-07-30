import { eq, notInArray } from 'drizzle-orm'
import { getDefaultStore } from 'jotai'

import { db } from '~/db'
import { entries, feeds } from '~/db/schema'
import { tabTitleAtom } from '~/hooks/use-tab-title'

import { apiClient } from './client'

export async function getFeeds() {
  const subscriptions = await apiClient.subscriptions.$get({ query: {} })
  const reads = await apiClient.reads.$get({ query: {} })

  return subscriptions.data.map(subscription => ({
    ...subscription,
    ...subscription.feeds,
    unread: reads.data[subscription.feedId] ?? 0,
  }))
}

export async function syncFeeds() {
  const store = getDefaultStore()
  const tabTitle = store.get(tabTitleAtom)
  store.set(tabTitleAtom, 'Syncing...')

  const feedsFromApi = await getFeeds()
  const existFeedIds = feedsFromApi.map(feed => feed.feedId)

  await Promise.all([
    ...feedsFromApi.map(async (feed) => {
      const feedInDB = await db.query.feeds.findFirst({
        where: eq(feeds.id, feed.feedId),
      })
      if (!feedInDB) {
        return db.insert(feeds)
          .values(feed)
      }
      return db.update(feeds)
        .set(feed)
        .where(eq(feeds.id, feed.feedId))
    }),

    db.delete(feeds).where(notInArray(feeds.id, existFeedIds)),
    db.delete(entries).where(notInArray(entries.feedId, existFeedIds)),
  ])

  store.set(tabTitleAtom, tabTitle)
}
