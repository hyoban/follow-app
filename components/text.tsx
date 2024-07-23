import type { TextProps as NativeTextProps, TextStyle } from 'react-native'
import { Text as NativeText } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import type { Color, ColorKey, Spacing } from '~/theme'

export type TextProps = NativeTextProps & {
  size?: Spacing
  contrast?: 'high' | 'low'
  weight?: TextStyle['fontWeight']
  color?: Color
}

export function Text({
  size = 4,
  contrast = 'high',
  weight = 'regular',
  color,
  style,
  ...rest
}: TextProps) {
  const { theme } = useStyles()
  return (
    <NativeText
      style={{
        fontFamily: 'SN Pro',
        color: theme.colors[
          contrast === 'high'
            ? `${color ?? 'gray'}12` as ColorKey
            : `${color ?? 'gray'}11` as ColorKey
        ],
        fontSize: theme.spacing[size],
        fontWeight: weight,
        ...(typeof style === 'object' ? style : {}),
      }}
      {...rest}
    />
  )
}
