import type { TextProps as NativeTextProps, TextStyle } from 'react-native'
import { Platform, Text as NativeText } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { Color, ThemeColorKey } from '~/theme'

type VariantProps = {
  size?: number | undefined
  contrast?: 'high' | 'low'
  weight?: TextStyle['fontWeight']
  color?: Color
}

function getFontFamily(
  fontWeight: TextStyle['fontWeight'],
  fontStyle: TextStyle['fontStyle'],
) {
  if (Platform.OS === 'ios') {
    return 'SN Pro'
  }

  let fontFamily = 'SNPro-Regular'
  if (fontWeight && ['bold', 600, 700].includes(fontWeight)) {
    fontFamily = 'SNPro-Bold'
  }

  if (fontStyle === 'italic') {
    fontFamily += 'Italic'
  }
  return fontFamily
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

    return {
      fontFamily: getFontFamily(weight, 'normal'),
      color: theme.colors[
        color === 'accentContrast'
          ? 'accentContrast'
          : contrast === 'high'
            ? `${color}12` as ThemeColorKey
            : `${color}11` as ThemeColorKey
      ],
      fontSize: size,
      fontWeight: weight,
      lineHeight: size * 1.5,
    }
  },
}))
