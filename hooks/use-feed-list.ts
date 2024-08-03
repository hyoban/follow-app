import type { TabViewIndex } from '~/atom/layout'
import { db } from '~/db'

import { useQuerySubscription } from './use-query-subscription'

export function useFeedList(view: TabViewIndex) {
  return useQuerySubscription(
    db.query.feeds.findMany({
      where(schema, { eq }) {
        return eq(schema.view, view)
      },
    }),
    ['feeds', { view }],
  )
}
