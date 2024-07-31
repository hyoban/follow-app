import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage<string[]>(() => AsyncStorage)
export const unreadOnlyListAtom = atomWithStorage<string[]>('unread-only-map', [], storage)
export const toggleUnreadOnlyListAtom = atom(null, async (get, set, update: string[]) => {
  const unreadOnlyList = await get(unreadOnlyListAtom)
  const target = update.join('/')
  set(
    unreadOnlyListAtom,
    unreadOnlyList.includes(target)
      ? unreadOnlyList.filter(i => i !== target)
      : [...unreadOnlyList, target],
  )
    .catch(console.error)
})
