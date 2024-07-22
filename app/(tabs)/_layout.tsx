import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Iconify } from '~/components'

export default function TabLayout() {
  const { styles } = useStyles(stylesheet)
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <Iconify icon="mingcute:table-2-line" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Iconify
                    icon="mingcute:settings-3-line"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>

            </Link>
          ),
          headerTitleStyle: styles.title,
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <Iconify icon="mingcute:table-2-line" color={color} />,
          headerTitleStyle: styles.title,
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
        }}
      />
    </Tabs>
  )
}

const stylesheet = createStyleSheet(theme => ({
  header: {
    backgroundColor: theme.colors.gray2,
  },
  tabBar: {
    backgroundColor: theme.colors.gray2,
  },
  title: {
    color: theme.colors.gray12,
  },
}))
