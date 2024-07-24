import type { TextProps as NativeTextProps, TextStyle } from 'react-native'
import { Text as NativeText } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { Color, Size, ThemeColorKey } from '~/theme'

type VariantProps = {
  size?: Size
  contrast?: 'high' | 'low'
  weight?: TextStyle['fontWeight']
  color?: Color
}

export type TextProps = Omit<NativeTextProps, 'style'> & VariantProps

export function Text({
  size,
  contrast,
  weight,
  color,
  ...rest
}: TextProps) {
  const { styles } = useStyles(styleSheet)
  return (
    <NativeText
      style={styles.text({ size, contrast, weight, color })}
      {...rest}
    />
  )
}

const styleSheet = createStyleSheet(theme => ({
  text(variant?: VariantProps) {
    const {
      size = 4,
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
      fontSize: theme.spacing[size ?? 4],
      fontWeight: weight,
    }
  },
}))
