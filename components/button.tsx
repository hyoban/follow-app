import type { PressableProps } from 'react-native'
import { ActivityIndicator, Pressable } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { Color, Radius, ThemeColorKey } from '~/theme'

import { Text } from './text'

type VariantProps = {
  color?: Color
  radius?: Radius
  fullWidth?: boolean
  variant?: 'solid' | 'outlined' | 'ghost'
  isLoading?: boolean
}

type ButtonProps = Omit<PressableProps, 'style'> & VariantProps

export function Button({
  children,
  color,
  radius,
  fullWidth,
  variant,
  isLoading,
  ...rest
}: ButtonProps) {
  const { styles } = useStyles(styleSheet)
  return (
    <Pressable
      style={({ pressed }) => (
        styles.button(
          pressed,
          { color, radius, fullWidth, variant },
        )
      )}
      {...rest}
    >
      {isLoading ? <ActivityIndicator /> : children}
    </Pressable>
  )
}

type TextButtonProps = Omit<ButtonProps, 'children'> & { title: string }

export function TextButton({ title, ...rest }: TextButtonProps) {
  return (
    <Button {...rest}>
      <Text
        contrast="low"
        color={rest.variant === 'solid' ? 'accentContrast' : rest.color}
      >
        {title}
      </Text>
    </Button>
  )
}

const styleSheet = createStyleSheet(theme => ({
  button(pressed: boolean, props?: VariantProps) {
    const { color = 'gray', radius, fullWidth, variant } = props ?? {}
    if (variant === 'ghost') {
      return {}
    }

    return {
      padding: theme.spacing[3],
      borderRadius: theme.radius[radius ?? 'medium'],
      backgroundColor: pressed
        ? theme.colors[`${color}${variant === 'solid' ? 10 : 5}` as ThemeColorKey]
        : theme.colors[`${color}${variant === 'solid' ? 9 : 3}` as ThemeColorKey],
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
