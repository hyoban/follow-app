import { useAtomValue } from 'jotai'
import { useState } from 'react'

import { db } from '~/db'
import { showUnreadOnlyAtom } from '~/store/entry'

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
        if (!showUnreadOnly && data) {
          setUnreadItems(new Set(data.filter(i => !i.read).map(i => i.id)))
        }
      },
    },
  )

  const [unreadItems, setUnreadItems] = useState<Set<string> | null>(null)
  if (!unreadItems && sub.data) {
    setUnreadItems(new Set(sub.data.filter(i => !i.read).map(i => i.id)))
  }

  return {
    ...sub,
    data: sub.data?.filter(i => !showUnreadOnly || !unreadItems || unreadItems.has(i.id)),
  }
}
