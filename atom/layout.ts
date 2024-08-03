import { atom } from 'jotai'

export type TabViewIndex = 0 | 1 | 2 | 3 | 4 | 5
type ViewLayoutMap = Record<TabViewIndex, 'list' | 'detail'>

export const viewLayoutMapAtom = atom<ViewLayoutMap>(
  {
    0: 'list',
    1: 'list',
    2: 'list',
    3: 'list',
    4: 'list',
    5: 'list',
  },
)
