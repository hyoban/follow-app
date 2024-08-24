import { useMemo } from 'react'

import { db } from '~/db'
import type { TabViewIndex } from '~/store/layout'

import { useQuerySubscription } from './use-query-subscription'

export function useUnreadCount(view?: TabViewIndex) {
  const { data } = useQuerySubscription(
    db.query.feeds.findMany({
      where(fields, operators) {
        if (view !== undefined) {
          return operators.eq(fields.view, view)
        }
      },
    }),
    ['feed-unread-count', view],
  )
  return data?.reduce((acc, feed) => acc + feed.unread, 0) ?? 0
}

export function useUnreadCountList() {
  const count0 = useUnreadCount(0)
  const count1 = useUnreadCount(1)
  const count2 = useUnreadCount(2)
  const count3 = useUnreadCount(3)
  const count4 = useUnreadCount(4)
  const count5 = useUnreadCount(5)
  const countList = useMemo(
    () => [
      count0,
      count1,
      count2,
      count3,
      count4,
      count5,
    ] as const,
    [
      count0,
      count1,
      count2,
      count3,
      count4,
      count5,
    ],
  )
  return countList
}
