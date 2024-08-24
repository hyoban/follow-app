import { useAtomValue } from 'jotai'

import { db } from '~/db'
import { showUnreadOnlyAtom } from '~/store/entry'
import type { TabViewIndex } from '~/store/layout'

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
