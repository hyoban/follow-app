import { gray, grayDark } from '@radix-ui/colors'

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 40,
  8: 48,
  9: 64,
} as const
export type Spacing = keyof typeof spacing

export const lightTheme = {
  colors: {
    ...gray,
  },
  spacing,
} as const

export const darkTheme = {
  colors: {
    ...grayDark,
  },
  spacing,
} as const

// define other themes
