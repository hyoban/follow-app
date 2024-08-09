import '../theme/unistyles'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UnistylesRuntime } from 'react-native-unistyles'

import { Text } from '~/components'
import { db, expoDb } from '~/db'
import migrations from '~/drizzle/migrations'

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(app)',
}

function DrizzleStudio() {
  useDrizzleStudio(expoDb)
  return null
}

export default function Root() {
  const { success, error } = useMigrations(db, migrations)

  if (error) {
    return (
      <SafeAreaView>
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    )
  }

  if (!success) {
    return (
      <SafeAreaView>
        <Text>Migration is in progress...</Text>
      </SafeAreaView>
    )
  }

  return (
    <ThemeProvider
      value={UnistylesRuntime.colorScheme === 'light' ? DefaultTheme : DarkTheme}
    >
      {__DEV__ && <DrizzleStudio />}
      <Slot />
    </ThemeProvider>
  )
}
