import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { unreadOnlyListAtom } from '~/atom/entry-list'
import { db } from '~/db'

import { useQuerySubscription } from './use-query-subscription'

export function useShowUnreadOnly(feedIdList: string[]) {
  const unreadOnlyList = useAtomValue(unreadOnlyListAtom)
  return useMemo(
    () => unreadOnlyList.includes(feedIdList.join('/')),
    [feedIdList, unreadOnlyList],
  )
}

export function useEntryList(
  feedIdList: string[],
) {
  const showUnreadOnly = useShowUnreadOnly(feedIdList)
  return useQuerySubscription(
    db.query.entries.findMany({
      where(fields, { inArray, and, eq }) {
        return !showUnreadOnly
          ? inArray(fields.feedId, feedIdList ?? [])
          : and(
            inArray(fields.feedId, feedIdList ?? []),
            eq(fields.read, false),
          )
      },
      orderBy(fields, { desc }) {
        return [desc(fields.publishedAt)]
      },
      with: {
        feed: true,
      },
    }),
    ['entries', { feedIdList, showUnreadOnly }],
  )
}
