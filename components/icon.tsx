import { Iconify as Icon } from 'react-native-iconify'
import { useStyles } from 'react-native-unistyles'

export function Iconify({
  size = 24,
  variant = 'gray',
  color,
  ...rest
}: React.ComponentProps<typeof Icon> & { variant?: 'accent' | 'gray' }) {
  const { theme } = useStyles()
  const themeColor = variant === 'accent' ? theme.colors.accent9 : theme.colors.gray12
  return (
    <Icon
      size={size}
      color={color || themeColor}
      {...rest}
    />
  )
}
