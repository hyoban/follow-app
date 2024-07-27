import { Tabs } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Iconify } from '~/components'
import { SettingsLink } from '~/components/settings-link'
import type { ThemeColorKey } from '~/theme'

const views = [
  {
    name: 'index',
    title: 'Articles',
    icon: (color: string) => <Iconify icon="mingcute:paper-fill" color={color} />,
    color: 'orange',
  },
  {
    name: 'social',
    title: 'Social Media',
    icon: (color: string) => <Iconify icon="mingcute:twitter-fill" color={color} />,
    color: 'sky',
  },
  {
    name: 'picture',
    title: 'Pictures',
    icon: (color: string) => <Iconify icon="mingcute:pic-fill" color={color} />,
    color: 'green',
  },
  {
    name: 'video',
    title: 'Videos',
    icon: (color: string) => <Iconify icon="mingcute:video-fill" color={color} />,
    color: 'red',
  },
  {
    name: 'audio',
    title: 'Audios',
    icon: (color: string) => <Iconify icon="mingcute:mic-fill" color={color} />,
    color: 'purple',
  },
  {
    name: 'notification',
    title: 'Notifications',
    icon: (color: string) => <Iconify icon="mingcute:announcement-fill" color={color} />,
    color: 'yellow',
  },
]

export default function TabLayout() {
  const { styles, theme } = useStyles(stylesheet)
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <SettingsLink />,
      }}
    >
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
            headerTitleStyle: styles.title,
            headerStyle: styles.header,
          }}
        />
      ))}
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
