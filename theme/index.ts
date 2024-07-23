import {
  gray,
  grayDark,
  green,
  greenDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from '@radix-ui/colors'

export const colors = [
  'gray',
  'green',
  'red',
  'yellow',
] as const
export type Color = (typeof colors)[number]

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

export const scaling = [
  0.9,
  0.95,
  1,
  1.05,
  1.1,
] as const
export type Scaling = (typeof scaling)[number]

export const radius = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16,
  full: 9999,
} as const
export type Radius = keyof typeof radius

export const lightTheme = {
  colors: {
    ...gray,
    ...red,
    ...yellow,
    ...green,
    pure: '#000',
  },
  spacing,
  radius,
} as const

export const darkTheme = {
  colors: {
    ...grayDark,
    ...redDark,
    ...yellowDark,
    ...greenDark,
    pure: '#fff',
  },
  spacing,
  radius,
} as const

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
type _ExpectLightAndDarkThemesHaveSameKeys = Expect<Equal<
  keyof typeof lightTheme.colors,
  keyof typeof darkTheme.colors
>>

export type ThemeColorKey = keyof typeof lightTheme.colors
