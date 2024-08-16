import { useAtomValue } from 'jotai'

import { showUnreadOnlyAtom } from '~/atom/entry-list'
import type { TabViewIndex } from '~/atom/layout'
import { db } from '~/db'

import { useQuerySubscription } from './use-query-subscription'

export function useFeedList(view: TabViewIndex) {
  const showUnreadOnly = useAtomValue(showUnreadOnlyAtom)
  return useQuerySubscription(
    db.query.feeds.findMany({
      where(schema, { eq, and, not }) {
        if (showUnreadOnly) {
          return and(eq(schema.view, view), not(eq(schema.unread, 0)))
        }

        return eq(schema.view, view)
      },
    }),
    ['feeds', { view, showUnreadOnly }],
  )
}
