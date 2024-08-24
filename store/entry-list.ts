import { atom } from 'jotai'

import { atomWithStorage } from './storage'

export const showUnreadOnlyAtom = atomWithStorage<boolean>('unread-only-list', false)
export const showFooterAtom = atom<boolean>(true)
