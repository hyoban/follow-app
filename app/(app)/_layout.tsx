import { Redirect, Stack } from 'expo-router'
import { useAtomValue } from 'jotai'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { currentViewTabAtom } from '~/atom/layout'
import { LayoutSwitch } from '~/components/layout-switch'
import { SettingsLink } from '~/components/settings-link'
import { db } from '~/db'
import { useQuerySubscription } from '~/hooks/use-query-subscription'

export default function RootLayout() {
  const { styles } = useStyles(styleSheet)

  const { data: user } = useQuerySubscription(db.query.users.findFirst(), 'current-user')

  const { title } = useAtomValue(currentViewTabAtom)

  if (!user)
    return <Redirect href="/sign-in" />

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerLargeTitle: true,
          title,
          headerRight: () => (
            <>
              <LayoutSwitch />
              <SettingsLink />
            </>
          ),
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerLargeTitleStyle: styles.title,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          title: 'Settings',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
        }}
      />
    </Stack>
  )
}

const styleSheet = createStyleSheet(theme => ({
  header: {
    backgroundColor: theme.colors.gray2,
  },
  title: {
    color: theme.colors.gray12,
    fontFamily: 'SN Pro',
    fontWeight: 'bold',
  },
}))
