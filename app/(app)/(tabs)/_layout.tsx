import * as Notifications from 'expo-notifications'
import { Tabs } from 'expo-router'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { syncFeedsEffect } from '~/api/feed'
import { tabViewList } from '~/consts/view'
import { useUnreadCount, useUnreadCountList } from '~/hooks/use-badge-count'
import type { ThemeColorKey } from '~/theme'
import { isTablet } from '~/theme/breakpoints'

export default function TabLayout() {
  const { styles, theme, breakpoint } = useStyles(stylesheet)
  useAtomValue(syncFeedsEffect)
  const countList = useUnreadCountList()

  const unreadCount = useUnreadCount()
  useEffect(() => {
    Notifications.requestPermissionsAsync()
      .then(() => Notifications.setBadgeCountAsync(unreadCount))
      .catch(console.error)
  }, [unreadCount])

  return (
    <Tabs>
      {tabViewList.map(view => (
        <Tabs.Screen
          key={view.name}
          name={view.name}
          options={{
            href: {
              pathname: view.path as any,
              params: {
                view: view.view,
                title: view.title,
              },
            },
            title: view.title,
            tabBarIcon: ({ color }) => view.icon(color),
            tabBarActiveTintColor: theme.colors[`${view.color}9` as ThemeColorKey],
            tabBarShowLabel: isTablet(breakpoint),
            tabBarStyle: styles.tabBar,
            headerShown: false,
            tabBarBadge: countList[view.view] > 0 ? isTablet(breakpoint) ? countList[view.view] : '' : undefined,
            tabBarBadgeStyle: {
              transform: [
                { scale: isTablet(breakpoint) ? 0.8 : 0.4 },
                { translateX: isTablet(breakpoint) ? -35 : 0 },
              ],
            },
          }}
        />
      ))}
    </Tabs>
  )
}

const stylesheet = createStyleSheet(theme => ({
  tabBar: {
    backgroundColor: theme.colors.gray2,
    borderTopColor: theme.colors.gray6,
  },
  title: {
    color: theme.colors.gray12,
  },
}))
