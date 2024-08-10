import { atomWithStorage } from './storage'

export const showUnreadOnlyAtom = atomWithStorage<boolean>('unread-only-list', false)
