import { useAtomValue } from 'jotai'
import { useState } from 'react'

import { db } from '~/db'
import { showUnreadOnlyAtom } from '~/store/entry'
import type { TabViewIndex } from '~/store/layout'

import { useQuerySubscription } from './use-query-subscription'

export function useFeedList(view: TabViewIndex) {
  const showUnreadOnly = useAtomValue(showUnreadOnlyAtom)
  const sub = useQuerySubscription(
    db.query.feeds.findMany({
      where(schema, { eq }) {
        return eq(schema.view, view)
      },
    }),
    ['feeds', { view }],
    {
      afterRevalidate(data) {
        if (!showUnreadOnly && data) {
          setUnreadItems(new Set(data.filter(i => i.unread).map(i => i.id)))
        }
      },
    },
  )

  const [unreadItems, setUnreadItems] = useState<Set<string> | null>(null)
  if (!unreadItems && sub.data) {
    setUnreadItems(new Set(sub.data.filter(i => i.unread).map(i => i.id)))
  }

  return {
    ...sub,
    data: sub.data?.filter(i => !showUnreadOnly || !unreadItems || unreadItems.has(i.id)),
  }
}
