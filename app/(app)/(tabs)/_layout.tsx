import { Tabs } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { syncFeedsEffect } from '~/api/feed'
import type { TabViewIndex } from '~/atom/layout'
import { updateCurrentViewTabAtom } from '~/atom/layout'
import { tabViewList } from '~/consts/view'
import type { ThemeColorKey } from '~/theme'

export default function TabLayout() {
  const { styles, theme } = useStyles(stylesheet)
  useAtomValue(syncFeedsEffect)
  const updateCurrentViewTab = useSetAtom(updateCurrentViewTabAtom)

  return (
    <Tabs
      screenListeners={{
        state: (state) => {
          updateCurrentViewTab(state.data.state.index as TabViewIndex)
        },
      }}
    >
      {tabViewList.map(view => (
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
    borderTopColor: theme.colors.gray6,
  },
  title: {
    color: theme.colors.gray12,
  },
}))
