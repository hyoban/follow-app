import * as Notifications from 'expo-notifications'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useStyles } from 'react-native-unistyles'

import { syncFeedsEffect } from '~/api/feed'
import { Tabs } from '~/components/bottom-tabs'
import { tabViewList } from '~/consts/view'
import { useUnreadCount, useUnreadCountList } from '~/hooks/use-badge-count'
import { isTablet } from '~/theme/breakpoints'

export default function TabLayout() {
  const { breakpoint } = useStyles()
  useAtomValue(syncFeedsEffect)
  const countList = useUnreadCountList()

  const unreadCount = useUnreadCount()
  useEffect(() => {
    Notifications.requestPermissionsAsync()
      .then(() => Notifications.setBadgeCountAsync(unreadCount))
      .catch(console.error)
  }, [unreadCount])

  return (
    <Tabs
      labeled={isTablet(breakpoint)}
    >
      {tabViewList.map(view => (
        <Tabs.Screen
          key={view.name}
          name={view.name}
          options={{
            title: view.title,
            tabBarIcon: view.iconRequire,
            tabBarBadge: `${countList[view.view] > 0 ? countList[view.view] : ''}`,
          }}
        />
      ))}
    </Tabs>
  )
}
