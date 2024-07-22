import { gray, grayDark } from '@radix-ui/colors'

export const size = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
  9: 96,
} as const
export type Size = keyof typeof size

export const lightTheme = {
  colors: {
    ...gray,
  },
  size,
} as const

export const darkTheme = {
  colors: {
    ...grayDark,
  },
  size,
} as const

// define other themes
