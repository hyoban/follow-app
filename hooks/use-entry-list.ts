import { useAtomValue } from 'jotai'

import { showUnreadOnlyAtom } from '~/atom/entry-list'
import { db } from '~/db'

import { useQuerySubscription } from './use-query-subscription'

export function useEntryList(
  feedIdList: string[],
) {
  const showUnreadOnly = useAtomValue(showUnreadOnlyAtom)
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
