import { atom } from 'jotai'

import { atomWithStorage } from './storage'

export const showUnreadOnlyAtom = atomWithStorage<boolean>('unread-only-list', false)
export const showFooterAtom = atom<boolean>(true)

export const enableReadabilityMapAtom = atomWithStorage<Record<string, boolean>>('readability-map', {})
export const toggleEnableReadabilityMapAtom = atom(null, (_get, set, key: string) => {
  set(enableReadabilityMapAtom, (prev) => {
    const next = { ...prev }
    next[key] = !next[key]
    return next
  })
})
