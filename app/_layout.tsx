import '../theme/unistyles'

import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { Slot } from 'expo-router'
import { openDatabaseSync } from 'expo-sqlite'
import { View } from 'react-native'

import { Text } from '~/components'
import migrations from '~/drizzle/migrations'

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(app)',
}

const expoDb = openDatabaseSync('db.db')
const db = drizzle(expoDb)

export default function Root() {
  useDrizzleStudio(expoDb)
  const { success, error } = useMigrations(db, migrations)

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
    <Slot />
  )
}
