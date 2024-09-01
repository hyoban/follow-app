import { getDefaultStore, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { unstable_serialize } from 'swr'

import { db } from '~/db'
import { setUnreadEntryListAtom, showUnreadOnlyAtom, unreadEntryMapAtom } from '~/store/entry'

import { useQuerySubscription } from './use-query-subscription'

export function useEntryList(
  feedIdList: string[],
) {
  const showUnreadOnly = useAtomValue(showUnreadOnlyAtom)
  const sub = useQuerySubscription(
    db.query.entries.findMany({
      where(fields, { inArray }) {
        return inArray(fields.feedId, feedIdList ?? [])
      },
      orderBy(fields, { desc }) {
        return [desc(fields.publishedAt)]
      },
      with: {
        feed: true,
      },
    }),
    ['entries', { feedIdList }],
    {
      afterRevalidate(data) {
        const showUnreadOnly = getDefaultStore().get(showUnreadOnlyAtom)
        if (!showUnreadOnly && data) {
          setUnreadItems(
            feedIdList,
            data.filter(i => !i.read).map(i => i.id),
          )
        }
      },
    },
  )

  const unreadEntryMap = useAtomValue(unreadEntryMapAtom)
  const setUnreadItems = useSetAtom(setUnreadEntryListAtom)
  const unreadItems = unreadEntryMap[unstable_serialize(feedIdList)]

  useEffect(() => {
    if (!unreadItems && sub.data) {
      setUnreadItems(
        feedIdList,
        sub.data.filter(i => !i.read).map(i => i.id),
      )
    }
  }, [feedIdList, setUnreadItems, sub.data, unreadItems])

  return {
    ...sub,
    data: sub.data?.filter(i => !showUnreadOnly || !unreadItems || unreadItems.has(i.id)),
  }
}
