import { Redirect, Stack } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Row } from '~/components'
import { LayoutSwitch } from '~/components/layout-switch'
import { LoadingIndicator } from '~/components/loading-indicator'
import { SettingsLink } from '~/components/settings-link'
import { UnreadFilter } from '~/components/unread-filter'
import { useCurrentUser } from '~/hooks/use-current-user'
import { useTabInfo } from '~/hooks/use-tab-info'

export default function RootLayout() {
  const { styles } = useStyles(styleSheet)

  const { user } = useCurrentUser()
  const { title } = useTabInfo()

  if (!user)
    return <Redirect href="/auth" />

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          title,
          headerLeft: () => (
            <Row gap={18} style={styles.header}>
              <SettingsLink />
            </Row>
          ),
          headerRight: () => (
            <Row gap={18} style={styles.header}>
              <LoadingIndicator />
              <UnreadFilter />
              <LayoutSwitch />
            </Row>
          ),
          headerTitleAlign: 'center',
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
