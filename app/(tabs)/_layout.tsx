import { Link, Tabs } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HeaderButton } from '~/components/HeaderButton'
import { TabBarIcon } from '~/components/TabBarIcon'

export default function TabLayout() {
  const { styles } = useStyles(stylesheet)
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <HeaderButton />
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
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
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
