import { atom, useAtomValue, useSetAtom } from 'jotai'
import { unstable_serialize } from 'swr'

import { db } from '~/db'
import { showUnreadOnlyAtom } from '~/store/entry'

import { useQuerySubscription } from './use-query-subscription'

const unreadEntryMapAtom = atom<Record<string, Set<string>>>({})
const setUnreadEntryListAtom = atom(null, (get, set, feedIdList: string[], entryList: string[]) => {
  set(unreadEntryMapAtom, {
    ...get(unreadEntryMapAtom),
    [unstable_serialize(feedIdList)]: new Set(entryList),
  })
})

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
  if (!unreadItems && sub.data) {
    setUnreadItems(
      feedIdList,
      sub.data.filter(i => !i.read).map(i => i.id),
    )
  }

  return {
    ...sub,
    data: sub.data?.filter(i => !showUnreadOnly || !unreadItems || unreadItems.has(i.id)),
  }
}
