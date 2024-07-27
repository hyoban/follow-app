import { eq } from 'drizzle-orm'

import { db } from '~/db'
import { feeds } from '~/db/schema'

import { apiClient } from './client'

export async function getFeeds() {
  const subscriptions = await apiClient.subscriptions.$get({ query: {} })
  const reads = await apiClient.reads.$get({ query: {} })

  return subscriptions.data.map(subscription => ({
    ...subscription,
    ...subscription.feeds,
    unread: reads.data[subscription.feedId],
  }))
}

export async function createOrUpdateFeedsInDB() {
  const feedsFromApi = await getFeeds()
  for (const feed of feedsFromApi) {
    const feedInDB = await db.query.feeds.findFirst({
      where: eq(feeds.id, feed.feedId),
    })
    if (feedInDB) {
      await db.update(feeds)
        .set(feed)
        .where(eq(feeds.id, feed.feedId))
    }
    else {
      await db.insert(feeds)
        .values(feed)
    }
  }
}
