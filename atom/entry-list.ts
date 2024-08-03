import { atom } from 'jotai'

export const unreadOnlyListAtom = atom<string[]>([])
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
