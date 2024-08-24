import { create } from 'zustand'

import type { TabViewIndex } from './layout'

type FeedIdListMap = Record<TabViewIndex, string[]>
type FeedIdListMapStore = {
  feedIdListMap: FeedIdListMap
  updateFeedIdListMap: (view: TabViewIndex, feedIdList: string[]) => void
}

export const useFeedIdListMapStore = create<FeedIdListMapStore>(set => ({
  feedIdListMap: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  },
  updateFeedIdListMap: (view, feedIdList) => set(state => ({
    feedIdListMap: {
      ...state.feedIdListMap,
      [view]: feedIdList,
    },
  })),
}))
