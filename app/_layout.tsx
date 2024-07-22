import '../theme/unistyles'

import { Stack } from 'expo-router'
import { useStyles } from 'react-native-unistyles'

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(tabs)',
}

export default function RootLayout() {
  const { theme } = useStyles()

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          title: 'User',
          headerStyle: {
            backgroundColor: theme.colors.gray2,
          },
          headerTitleStyle: {
            color: theme.colors.gray12,
          },
        }}
      />
    </Stack>
  )
}
