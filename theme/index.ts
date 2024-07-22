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

export const scaling = [0.9, 0.95, 1, 1.05, 1.1] as const
export type Scaling = (typeof scaling)[number]

export const radius = ['none', 'small', 'medium', 'large', 'full'] as const
export type Radius = (typeof radius)[number]

export const lightTheme = {
  colors: {
    ...gray,
    pure: '#000',
  },
  spacing,
} as const

export const darkTheme = {
  colors: {
    ...grayDark,
    pure: '#fff',
  },
  spacing,
} as const
