import { atomWithStorage as originalAtomWithStorage } from 'jotai/utils'
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export type JotaiStorage<T = unknown> = Exclude<Parameters<typeof originalAtomWithStorage<T>>[2], undefined>

export const jotaiStorage: JotaiStorage = {
  getItem(key, initialValue) {
    const value = storage.getString(key)
    return value === undefined
      ? initialValue
      : JSON.parse(value)
  },
  setItem(key, newValue) {
    storage.set(key, JSON.stringify(newValue))
  },
  removeItem(key) {
    storage.delete(key)
  },
}

export function atomWithStorage<T>(key: string, initialValue: T) {
  return originalAtomWithStorage(key, initialValue, jotaiStorage as JotaiStorage<T>, { getOnInit: true })
}
