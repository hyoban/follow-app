import { atom } from 'jotai'

import type { TabViewIndex } from './layout'
import { atomWithStorage } from './storage'

export const showUnreadOnlyAtom = atomWithStorage<boolean>('unread-only-list', false)
export const entryListToRefreshAtom = atom<TabViewIndex | false>(false)
