import type { TextProps as NativeTextProps, TextStyle } from 'react-native'
import { Text as NativeText } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { Color, ThemeColorKey } from '~/theme'

type VariantProps = {
  size?: number | undefined
  contrast?: 'high' | 'low'
  weight?: TextStyle['fontWeight']
  color?: Color
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
      size = 16,
      contrast = 'high',
      weight = 'regular',
      color,
    } = variant ?? {}

    return {
      fontFamily: 'SN Pro',
      color: theme.colors[
        contrast === 'high'
          ? `${color ?? 'gray'}12` as ThemeColorKey
          : `${color ?? 'gray'}11` as ThemeColorKey
      ],
      fontSize: size,
      fontWeight: weight,
      lineHeight: size * 1.5,
    }
  },
}))
