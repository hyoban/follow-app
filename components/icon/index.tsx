import { useStyles } from 'react-native-unistyles'

import { Iconify as Icon } from './iconify'

type IconProps = React.ComponentProps<typeof Icon> & { variant?: 'accent' | 'gray' }

export function Iconify({
  size = 24,
  variant = 'gray',
  color,
  ...rest
}: IconProps) {
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
