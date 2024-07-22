import { Iconify as Icon } from 'react-native-iconify'
import { useStyles } from 'react-native-unistyles'

export function Iconify({
  size = 24,
  ...rest
}: React.ComponentProps<typeof Icon>) {
  const { theme } = useStyles()
  return (
    <Icon
      size={size}
      color={theme.colors.gray12}
      {...rest}
    />
  )
}
