import { Stack, useLocalSearchParams } from 'expo-router'
import { useAtomValue } from 'jotai'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import type { TabViewIndex } from '~/atom/layout'
import { currentViewTabAtom } from '~/atom/layout'
import { EntryList } from '~/components/entry-list'
import { UnreadFilter } from '~/components/unread-filter'

type PageLocalSearchParams = {
  feedId: string[]
  title: string
  view: string
}

export default function Page() {
  const { styles } = useStyles(stylesheet)
  const { title: headerBackTitle } = useAtomValue(currentViewTabAtom)
  const {
    feedId: feedIdList,
    title: headerTitle,
    view,
  } = useLocalSearchParams<PageLocalSearchParams>()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle,
          headerBackTitle,
          headerTitleStyle: styles.text,
          headerStyle: styles.bg,
          headerRight: () => <UnreadFilter feedIdList={feedIdList ?? []} />,
        }}
      />
      <EntryList
        feedIdList={feedIdList ?? []}
        view={Number.isInteger(Number(view)) ? Number(view) as TabViewIndex : undefined}
      />
    </>
  )
}

const stylesheet = createStyleSheet(theme => ({
  bg: {
    backgroundColor: theme.colors.gray2,
  },
  text: {
    color: theme.colors.gray12,
  },
}))
