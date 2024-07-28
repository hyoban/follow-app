import { Tabs } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { views } from '~/consts/view'
import type { ThemeColorKey } from '~/theme'

export default function TabLayout() {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Tabs>
      {views.map(view => (
        <Tabs.Screen
          key={view.name}
          name={view.name}
          options={{
            title: view.title,
            tabBarIcon: ({ color }) => view.icon(color),
            tabBarActiveTintColor: theme.colors[`${view.color}9` as ThemeColorKey],
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
            headerShown: false,
          }}
        />
      ))}
    </Tabs>
  )
}

const stylesheet = createStyleSheet(theme => ({
  tabBar: {
    backgroundColor: theme.colors.gray2,
  },
  title: {
    color: theme.colors.gray12,
  },
}))
