import { atom } from 'jotai'
import { unstable_serialize } from 'swr'

import { atomWithStorage } from './storage'

export const unreadEntryMapAtom = atom<Record<string, Set<string>>>({})
export const setUnreadEntryListAtom = atom(null, (get, set, feedIdList: string[], entryList: string[]) => {
  set(unreadEntryMapAtom, {
    ...get(unreadEntryMapAtom),
    [unstable_serialize(feedIdList)]: new Set(entryList),
  })
})
export const cleanUnreadEntryListAtom = atom(null, (_get, set) => {
  set(unreadEntryMapAtom, {})
})

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
