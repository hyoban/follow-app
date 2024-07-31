import AsyncStorage from '@react-native-async-storage/async-storage'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export type TabView = 0 | 1 | 2 | 3 | 4 | 5
type ViewLayoutMap = Record<TabView, 'list' | 'detail'>
const storage = createJSONStorage<ViewLayoutMap>(() => AsyncStorage)
export const viewLayoutMapAtom = atomWithStorage<ViewLayoutMap>(
  'view-layout-map',
  {
    0: 'detail',
    1: 'list',
    2: 'list',
    3: 'list',
    4: 'list',
    5: 'list',
  },
  storage,
)
