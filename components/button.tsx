import * as React from 'react'
import type { PressableProps, ViewStyle } from 'react-native'
import { Pressable } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import type { Color, ThemeColorKey } from '~/theme'

type ButtonProps = Omit<PressableProps, 'style'> & {
  style?: ViewStyle
  color?: Color
}

export function Button({
  children,
  style,
  color,
  ...rest
}: ButtonProps) {
  const { theme } = useStyles()
  return (
    <Pressable
      style={({ pressed }) => ({
        padding: theme.spacing[3],
        backgroundColor: pressed
          ? theme.colors[`${color ?? 'gray'}5` as ThemeColorKey]
          : theme.colors[`${color ?? 'gray'}3` as ThemeColorKey],
        borderRadius: theme.radius.medium,
        ...style,
      })}
      {...rest}
    >
      {children}
    </Pressable>
  )
}
