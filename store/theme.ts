import type { AccentColor } from '~/theme'

import { atomWithStorage } from './storage'

type UserTheme = 'system' | 'light' | 'dark'
export const userThemeAtom = atomWithStorage<UserTheme>('userTheme', 'system')

export const accentColorAtom = atomWithStorage<AccentColor>('accentColor', 'orange')
