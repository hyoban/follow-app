import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

import type { TabView } from '~/consts/view'
import { tabViewList } from '~/consts/view'

export type TabViewIndex = 0 | 1 | 2 | 3 | 4 | 5
type ViewLayoutMap = Record<TabViewIndex, 'list' | 'detail'>
const storage = createJSONStorage<ViewLayoutMap>(() => AsyncStorage)
export const viewLayoutMapAtom = atomWithStorage<ViewLayoutMap>(
  'view-layout-map',
  {
    0: 'list',
    1: 'list',
    2: 'list',
    3: 'list',
    4: 'list',
    5: 'list',
  },
  storage,
)

export const currentViewTabAtom = atom<TabView>(tabViewList.at(0)!)
export const updateCurrentViewTabAtom = atom(null, (_get, set, viewIndex: TabViewIndex) => {
  const view = tabViewList.find(view => view.view === viewIndex)
  if (view) {
    set(currentViewTabAtom, view)
  }
})
