import { db } from '~/db'
import type { TabViewIndex } from '~/store/layout'

import { useQuerySubscription } from './use-query-subscription'

export function useFeedList(view: TabViewIndex) {
  const sub = useQuerySubscription(
    db.query.feeds.findMany({
      where(schema, { eq }) {
        return eq(schema.view, view)
      },
    }),
    ['feeds', { view }],
  )

  return sub
}
