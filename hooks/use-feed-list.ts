import type { TabView } from '~/atom/layout'
import { db } from '~/db'

import { useQuerySubscription } from './use-query-subscription'

export function useFeedList(view: TabView) {
  return useQuerySubscription(
    db.query.feeds.findMany({
      where(schema, { eq }) {
        return eq(schema.view, view)
      },
    }),
    ['feeds', { view }],
  )
}
