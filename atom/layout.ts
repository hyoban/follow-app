import { atom } from 'jotai'

export const layoutAtom = atom<'feed' | 'entry'>('feed')
