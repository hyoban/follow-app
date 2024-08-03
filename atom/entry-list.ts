import { atom } from 'jotai'

import { atomWithStorage } from './storage'

export const unreadOnlyListAtom = atomWithStorage<string[]>('unread-only-list', [])
export const toggleUnreadOnlyAtom = atom(null, (get, set, update: string[]) => {
  const unreadOnlyList = get(unreadOnlyListAtom)
  const target = update.join('/')
  set(
    unreadOnlyListAtom,
    unreadOnlyList.includes(target)
      ? unreadOnlyList.filter(i => i !== target)
      : [...unreadOnlyList, target],
  )
})
