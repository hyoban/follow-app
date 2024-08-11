import * as allColors from '@radix-ui/colors'

const {
  amber,
  amberA,
  amberDark,
  amberDarkA,
  blackA,
  blue,
  blueA,
  blueDark,
  blueDarkA,
  bronze,
  bronzeA,
  bronzeDark,
  bronzeDarkA,
  brown,
  brownA,
  brownDark,
  brownDarkA,
  crimson,
  crimsonA,
  crimsonDark,
  crimsonDarkA,
  cyan,
  cyanA,
  cyanDark,
  cyanDarkA,
  gold,
  goldA,
  goldDark,
  goldDarkA,
  grass,
  grassA,
  grassDark,
  grassDarkA,
  gray,
  grayA,
  grayDark,
  grayDarkA,
  green,
  greenA,
  greenDark,
  greenDarkA,
  indigo,
  indigoA,
  indigoDark,
  indigoDarkA,
  iris,
  irisA,
  irisDark,
  irisDarkA,
  jade,
  jadeA,
  jadeDark,
  jadeDarkA,
  lime,
  limeA,
  limeDark,
  limeDarkA,
  mauve,
  mauveA,
  mauveDark,
  mauveDarkA,
  mint,
  mintA,
  mintDark,
  mintDarkA,
  olive,
  oliveA,
  oliveDark,
  oliveDarkA,
  orange,
  orangeA,
  orangeDark,
  orangeDarkA,
  pink,
  pinkA,
  pinkDark,
  pinkDarkA,
  plum,
  plumA,
  plumDark,
  plumDarkA,
  purple,
  purpleA,
  purpleDark,
  purpleDarkA,
  red,
  redA,
  redDark,
  redDarkA,
  ruby,
  rubyA,
  rubyDark,
  rubyDarkA,
  sage,
  sageA,
  sageDark,
  sageDarkA,
  sand,
  sandA,
  sandDark,
  sandDarkA,
  sky,
  skyA,
  skyDark,
  skyDarkA,
  slate,
  slateA,
  slateDark,
  slateDarkA,
  teal,
  tealA,
  tealDark,
  tealDarkA,
  tomato,
  tomatoA,
  tomatoDark,
  tomatoDarkA,
  violet,
  violetA,
  violetDark,
  violetDarkA,
  whiteA,
  yellow,
  yellowA,
  yellowDark,
  yellowDarkA,
} = allColors

const contrastColors = {
  grayContrast: '#fff',
  mauveContrast: '#fff',
  slateContrast: '#fff',
  sageContrast: '#fff',
  oliveContrast: '#fff',
  sandContrast: '#fff',
  amberContrast: '#21201c',
  blueContrast: '#fff',
  bronzeContrast: '#fff',
  brownContrast: '#fff',
  crimsonContrast: '#fff',
  cyanContrast: '#fff',
  goldContrast: '#fff',
  grassContrast: '#fff',
  greenContrast: '#fff',
  indigoContrast: '#fff',
  irisContrast: '#fff',
  jadeContrast: '#fff',
  limeContrast: '#1d211c',
  mintContrast: '#1a211e',
  orangeContrast: '#fff',
  pinkContrast: '#fff',
  plumContrast: '#fff',
  purpleContrast: '#fff',
  redContrast: '#fff',
  rubyContrast: '#fff',
  skyContrast: '#1c2024',
  tealContrast: '#fff',
  tomatoContrast: '#fff',
  violetContrast: '#fff',
  yellowContrast: '#21201c',
}

// @keep-sorted
export const accentColors = [
  'amber',
  'blue',
  'bronze',
  'brown',
  'crimson',
  'cyan',
  'gold',
  'grass',
  'gray',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mint',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'ruby',
  'sky',
  'teal',
  'tomato',
  'violet',
  'yellow',
] as const
type AccentColor = (typeof accentColors)[number]

type Accent = {
  accent1: string
  accent2: string
  accent3: string
  accent4: string
  accent5: string
  accent6: string
  accent7: string
  accent8: string
  accent9: string
  accent10: string
  accent11: string
  accent12: string
  accentContrast: string
}

type AccentA = {
  accentA1: string
  accentA2: string
  accentA3: string
  accentA4: string
  accentA5: string
  accentA6: string
  accentA7: string
  accentA8: string
  accentA9: string
  accentA10: string
  accentA11: string
  accentA12: string
}

export function getAccentColor(
  accentColor: AccentColor = 'orange',
) {
  if (!accentColors.includes(accentColor)) {
    throw new Error(`Invalid accent color: ${accentColor}`)
  }

  const accent = Object.fromEntries(
    Object.entries(allColors[accentColor])
      .map(([key, value]) => [key.replace(accentColor, 'accent'), value])
      .concat([['accentContrast', contrastColors[`${accentColor}Contrast`]]]),
  ) as Accent

  const accentA = Object.fromEntries(
    Object.entries(allColors[`${accentColor}A`])
      .map(([key, value]) => [key.replace(`${accentColor}A`, 'accentA'), value]),
  ) as AccentA

  const accentDark = Object.fromEntries(
    Object.entries(allColors[`${accentColor}Dark`])
      .map(([key, value]) => [key.replace(accentColor, 'accent'), value])
      .concat([['accentContrast', contrastColors[`${accentColor}Contrast`]]]),
  ) as Accent

  const accentDarkA = Object.fromEntries(
    Object.entries(allColors[`${accentColor}DarkA`])
      .map(([key, value]) => [key.replace(`${accentColor}A`, 'accentA'), value]),
  ) as AccentA

  return { accent, accentA, accentDark, accentDarkA }
}

const {
  accent,
  accentA,
  accentDark,
  accentDarkA,
} = getAccentColor()

// @keep-sorted
// eslint-disable-next-line unused-imports/no-unused-vars
const grayColors = [
  'auto',
  'gray',
  'mauve',
  'olive',
  'sage',
  'sand',
  'slate',
] as const
// eslint-disable-next-line unused-imports/no-unused-vars
type GrayColor = (typeof grayColors)[number]

// 31 colors
// @keep-sorted
export const colors = [
  'amber',
  'blue',
  'bronze',
  'brown',
  'crimson',
  'cyan',
  'gold',
  'grass',
  'gray',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mauve',
  'mint',
  'olive',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'ruby',
  'sage',
  'sand',
  'sky',
  'slate',
  'teal',
  'tomato',
  'violet',
  'yellow',
] as const
export type Color = (typeof colors)[number] | 'accent' | 'accentContrast'

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
export type Size = Spacing

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
    ...accent,
    ...accentA,
    ...whiteA,
    ...blackA,
    ...amber,
    ...blue,
    ...bronze,
    ...brown,
    ...crimson,
    ...cyan,
    ...gold,
    ...grass,
    ...gray,
    ...green,
    ...indigo,
    ...iris,
    ...jade,
    ...lime,
    ...mauve,
    ...mint,
    ...olive,
    ...orange,
    ...pink,
    ...plum,
    ...purple,
    ...red,
    ...ruby,
    ...sage,
    ...sand,
    ...sky,
    ...slate,
    ...teal,
    ...tomato,
    ...violet,
    ...yellow,
    ...amberA,
    ...blueA,
    ...bronzeA,
    ...brownA,
    ...crimsonA,
    ...cyanA,
    ...goldA,
    ...grassA,
    ...grayA,
    ...greenA,
    ...indigoA,
    ...irisA,
    ...jadeA,
    ...limeA,
    ...mauveA,
    ...mintA,
    ...oliveA,
    ...orangeA,
    ...pinkA,
    ...plumA,
    ...purpleA,
    ...redA,
    ...rubyA,
    ...sageA,
    ...sandA,
    ...skyA,
    ...slateA,
    ...tealA,
    ...tomatoA,
    ...violetA,
    ...yellowA,
    ...contrastColors,
  },
  spacing,
  radius,
} as const

export const darkTheme = {
  colors: {
    ...accentDark,
    ...accentDarkA,
    ...whiteA,
    ...blackA,
    ...amberDark,
    ...blueDark,
    ...bronzeDark,
    ...brownDark,
    ...crimsonDark,
    ...cyanDark,
    ...goldDark,
    ...grassDark,
    ...grayDark,
    ...greenDark,
    ...indigoDark,
    ...irisDark,
    ...jadeDark,
    ...limeDark,
    ...mauveDark,
    ...mintDark,
    ...oliveDark,
    ...orangeDark,
    ...pinkDark,
    ...plumDark,
    ...purpleDark,
    ...redDark,
    ...rubyDark,
    ...sageDark,
    ...sandDark,
    ...skyDark,
    ...slateDark,
    ...tealDark,
    ...tomatoDark,
    ...violetDark,
    ...yellowDark,
    ...amberDarkA,
    ...blueDarkA,
    ...bronzeDarkA,
    ...brownDarkA,
    ...crimsonDarkA,
    ...cyanDarkA,
    ...goldDarkA,
    ...grassDarkA,
    ...grayDarkA,
    ...greenDarkA,
    ...indigoDarkA,
    ...irisDarkA,
    ...jadeDarkA,
    ...limeDarkA,
    ...mauveDarkA,
    ...mintDarkA,
    ...oliveDarkA,
    ...orangeDarkA,
    ...pinkDarkA,
    ...plumDarkA,
    ...purpleDarkA,
    ...redDarkA,
    ...rubyDarkA,
    ...sageDarkA,
    ...sandDarkA,
    ...skyDarkA,
    ...slateDarkA,
    ...tealDarkA,
    ...tomatoDarkA,
    ...violetDarkA,
    ...yellowDarkA,
    ...contrastColors,
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
