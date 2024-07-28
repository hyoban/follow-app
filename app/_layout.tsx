import '../theme/unistyles'

import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { Stack } from 'expo-router'
import { openDatabaseSync } from 'expo-sqlite/next'
import { View } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { Text } from '~/components'
import { SettingsLink } from '~/components/settings-link'
import migrations from '~/drizzle/migrations'
import { useTabTitle } from '~/hooks/use-tab-title'

const expoDb = openDatabaseSync('db.db')
const db = drizzle(expoDb)

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(tabs)',
}

export default function RootLayout() {
  const title = useTabTitle()

  const { theme } = useStyles()

  const { success, error } = useMigrations(db, migrations)
  useDrizzleStudio(expoDb)

  if (error) {
    return (
      <View>
        <Text>
          Migration error:
          {error.message}
        </Text>
      </View>
    )
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerLargeTitle: true,
          title,
          headerRight: () => <SettingsLink />,
          headerStyle: {
            backgroundColor: theme.colors.gray2,
          },
          headerTitleStyle: {
            color: theme.colors.gray12,
          },
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          title: 'Settings',
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
