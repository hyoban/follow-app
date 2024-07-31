import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage<string[]>(() => AsyncStorage)
export const unreadOnlyFeedIdListAtom = atomWithStorage<string[]>('unread-only-feed-id-list', [], storage)
export const toggleUnreadOnlyFeedIdListAtom = atom(null, async (get, set, update: string[]) => {
  const unreadOnlyFeedIdList = await get(unreadOnlyFeedIdListAtom)
  if (update.every(feedId => unreadOnlyFeedIdList.includes(feedId))) {
    set(unreadOnlyFeedIdListAtom, unreadOnlyFeedIdList.filter(feedId => !update.includes(feedId)))
      .catch(console.error)
  }
  else {
    set(unreadOnlyFeedIdListAtom, [...unreadOnlyFeedIdList, ...update])
      .catch(console.error)
  }
})
