import { eq, notInArray } from 'drizzle-orm'
import { atom, getDefaultStore } from 'jotai'
import { atomEffect } from 'jotai-effect'
import { AppState } from 'react-native'

import { db } from '~/db'
import { entries, feeds } from '~/db/schema'

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

export const isSyncingFeedsAtom = atom(false)
const appStateAtom = atom('active')
export const syncFeedsEffect = atomEffect((get, set) => {
  const syncFeedsBackground = () => {
    syncFeeds({ indicator: 'title' })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        set(isSyncingFeedsAtom, false)
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

export async function syncFeeds(props?: { indicator?: 'title' | 'spinner' }) {
  const { indicator = 'spinner' } = props ?? {}

  const store = getDefaultStore()

  if (indicator === 'spinner') {
    store.set(isSyncingFeedsAtom, true)
  }

  const feedsFromApi = await getFeeds()
  const existFeedIds = feedsFromApi.map(feed => feed.feedId)

  await Promise.all([
    ...feedsFromApi.map(async (feed) => {
      const feedInDB = await db.query.feeds.findFirst({
        where: eq(feeds.id, feed.feedId),
      })
      if (!feedInDB) {
        console.info('Insert feed', feed.feeds.title)
        return await db.insert(feeds)
          .values(feed)
      }
      if (needUpdate(feed, feedInDB)) {
        console.info('Update feed', feed.feeds.title)
        return await db.update(feeds)
          .set(feed)
          .where(eq(feeds.id, feed.feedId))
      }
    }),

    db.delete(feeds).where(notInArray(feeds.id, existFeedIds)),
    db.delete(entries).where(notInArray(entries.feedId, existFeedIds)),
  ])

  if (indicator === 'spinner') {
    store.set(isSyncingFeedsAtom, false)
  }
}

function needUpdate(data: any, dataInDB: any) {
  const keys = Object.keys(dataInDB)
  return keys.some(key => data[key] !== dataInDB[key])
}
