import { eq, notInArray } from 'drizzle-orm'
import { atom, getDefaultStore } from 'jotai'
import { atomEffect } from 'jotai-effect'
import { AppState } from 'react-native'

import type { TabViewIndex } from '~/atom/layout'
import { isUpdatingFeedAtom } from '~/atom/loading'
import { db } from '~/db'
import type { Feed } from '~/db/schema'
import { entries, feeds } from '~/db/schema'

import { apiClient } from './client'

export async function createFeed(
  feed: Omit<Feed, 'unread' | 'view' | 'category' | 'isPrivate'>,
  options: { view: TabViewIndex, category: string, isPrivate: boolean },
) {
  const reads = await apiClient.reads.$get({ query: {} })
  const feedWithUnread: Feed = {
    ...feed,
    unread: reads.data[feed.id] ?? 0,
    ...options,
  }
  await db.insert(feeds).values(feedWithUnread)
}

export async function deleteFeed(feedId: string) {
  await Promise.all([
    apiClient.subscriptions.$delete({ json: { feedId } }),
    db.delete(entries).where(eq(entries.feedId, feedId)),
    db.delete(feeds).where(eq(feeds.id, feedId)),
  ])
}

export async function getFeeds(): Promise<Feed[]> {
  const subscriptions = await apiClient.subscriptions.$get({ query: {} })
  const reads = await apiClient.reads.$get({ query: {} })

  return subscriptions.data.map(subscription => ({
    ...subscription,
    ...subscription.feeds,
    unread: reads.data[subscription.feedId] ?? 0,
  }))
}

const appStateAtom = atom('active')
export const syncFeedsEffect = atomEffect((get, set) => {
  const syncFeedsBackground = () => {
    syncFeeds()
      .catch((error) => {
        console.error(error)
      })
  }

  syncFeedsBackground()

  const subscription = AppState.addEventListener(
    'change',
    (nextAppState) => {
      if (
        nextAppState === 'active'
        && get(appStateAtom) === 'background'
      ) {
        syncFeedsBackground()
      }
      set(appStateAtom, nextAppState)
    },
  )
  return () => {
    subscription.remove()
  }
})

export async function syncFeeds() {
  const store = getDefaultStore()

  store.set(isUpdatingFeedAtom, true)

  const feedsFromApi = await getFeeds()
  const existFeedIds = feedsFromApi.map(feed => feed.id)

  await Promise.all([
    ...feedsFromApi.map(async (feed) => {
      const feedInDB = await db.query.feeds.findFirst({
        where: eq(feeds.id, feed.id),
      })
      if (!feedInDB) {
        console.info('Insert feed', feed.title)
        return await db.insert(feeds)
          .values(feed)
      }
      if (needUpdate(feed, feedInDB)) {
        console.info('Update feed', feed.title)
        return await db.update(feeds)
          .set(feed)
          .where(eq(feeds.id, feed.id))
      }
    }),

    db.delete(feeds).where(notInArray(feeds.id, existFeedIds)),
    db.delete(entries).where(notInArray(entries.feedId, existFeedIds)),
  ])

  store.set(isUpdatingFeedAtom, false)
}

function needUpdate(data: any, dataInDB: any) {
  const keys = Object.keys(dataInDB)
  return keys.some(key => data[key] !== dataInDB[key])
}
