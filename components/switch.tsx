import type { SwitchProps } from 'react-native'
import { Switch as NativeSwitch } from 'react-native'
import { useStyles } from 'react-native-unistyles'

export function Switch(props: SwitchProps) {
  const { theme } = useStyles()
  return (
    <NativeSwitch
      trackColor={{ true: theme.colors.accent9 }}
      thumbColor="rgb(255, 255, 255)"
      {...props}
    />
  )
}
