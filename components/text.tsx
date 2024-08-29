import type { TextProps as NativeTextProps, TextStyle } from 'react-native'
import { Text as NativeText } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getFontFamily } from '~/lib/utils'
import type { Color, ThemeColorKey } from '~/theme'

type VariantProps = {
  size?: number | undefined
  contrast?: 'high' | 'low'
  weight?: TextStyle['fontWeight']
  color?: Color | string
}

export type TextProps = NativeTextProps & VariantProps

export function Text({
  size,
  contrast,
  weight,
  color,
  style,
  ...rest
}: TextProps) {
  const { styles } = useStyles(styleSheet)
  return (
    <NativeText
      style={[
        styles.text({ size, contrast, weight, color }),
        style,
      ]}
      {...rest}
    />
  )
}

const styleSheet = createStyleSheet(theme => ({
  text(variant?: VariantProps) {
    const {
      size = 17,
      contrast = 'high',
      weight = 'regular',
      color = 'gray',
    } = variant ?? {}
    const themeColorKey = color === 'accentContrast'
      ? 'accentContrast'
      : contrast === 'high'
        ? `${color}12` as ThemeColorKey
        : `${color}11` as ThemeColorKey

    return {
      fontFamily: getFontFamily(weight, 'normal'),
      color: theme.colors[themeColorKey] ?? color,
      fontSize: size,
      fontWeight: weight,
      lineHeight: size * 1.5,
    }
  },
}))
