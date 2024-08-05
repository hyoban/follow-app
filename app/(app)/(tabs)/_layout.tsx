import { Tabs } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import ContextMenu from 'react-native-context-menu-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { flagEntryReadStatus } from '~/api/entry'
import { syncFeedsEffect } from '~/api/feed'
import { entryListToRefreshAtom } from '~/atom/entry-list'
import { tabViewList } from '~/consts/view'
import { useUnreadCountList } from '~/hooks/use-badge-count'
import type { ThemeColorKey } from '~/theme'

const doublePressInterval = 500

export default function TabLayout() {
  const { styles, theme } = useStyles(stylesheet)
  useAtomValue(syncFeedsEffect)
  const countList = useUnreadCountList()

  const [lastPressTime, setLastPressTime] = useState<number | null>(null)
  const [lastPressTab, setLastPressTab] = useState<string | null>(null)
  const refreshEntryList = useSetAtom(entryListToRefreshAtom)

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
            tabBarIcon: ({ color }) => (
              <ContextMenu
                actions={[
                  { title: 'Mark as Read', systemIcon: 'circlebadge.fill' },
                ]}
                onPress={(e) => {
                  switch (e.nativeEvent.index) {
                    case 0: {
                      flagEntryReadStatus({ view: view.view })
                        .catch(console.error)
                      break
                    }
                    default: {
                      break
                    }
                  }
                }}
              >
                {view.icon(color)}
              </ContextMenu>
            ),
            tabBarActiveTintColor: theme.colors[`${view.color}9` as ThemeColorKey],
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
            headerShown: false,
            tabBarBadge: countList[view.view] > 0 ? countList[view.view] : undefined,
            tabBarBadgeStyle: {
              transform: [{ scale: 0.8 }],
            },
          }}
          listeners={{
            tabPress: (e) => {
              const now = Date.now()
              if (lastPressTab === view.name && now - (lastPressTime ?? 0) < doublePressInterval) {
                e.preventDefault()
                setLastPressTime(null)
                setLastPressTab(null)
                refreshEntryList(view.view)
              }
              else {
                setLastPressTime(now)
                setLastPressTab(view.name)
              }
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
