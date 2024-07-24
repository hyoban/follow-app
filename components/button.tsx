import type { PressableProps } from 'react-native'
import { Pressable } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { Color, Radius, ThemeColorKey } from '~/theme'

type VariantProps = {
  color?: Color
  radius?: Radius
  fullWidth?: boolean
}

type ButtonProps = Omit<PressableProps, 'style'> & VariantProps

export function Button({
  children,
  color,
  radius,
  fullWidth,
  ...rest
}: ButtonProps) {
  const { styles } = useStyles(styleSheet)
  return (
    <Pressable
      style={({ pressed }) => (styles.button(pressed, { color, radius, fullWidth }))}
      {...rest}
    >
      {children}
    </Pressable>
  )
}

const styleSheet = createStyleSheet(theme => ({
  button(pressed: boolean, variant?: VariantProps) {
    const { color, radius, fullWidth } = variant ?? {}

    return {
      padding: theme.spacing[3],
      borderRadius: theme.radius[radius ?? 'medium'],
      backgroundColor: pressed
        ? theme.colors[`${color ?? 'gray'}5` as ThemeColorKey]
        : theme.colors[`${color ?? 'gray'}3` as ThemeColorKey],
      ...(
        fullWidth
          ? {
              width: '100%',
              alignItems: 'center',
            }
          : {}
      ),
    }
  },
}))
