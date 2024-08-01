import { Stack, useLocalSearchParams } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { EntryList } from '~/components/entry-list'
import { UnreadFilter } from '~/components/unread-filter'
import { useTab } from '~/hooks/use-tab-title'

type PageLocalSearchParams = {
  feedId: string[]
  title: string
}

export default function Page() {
  const { styles } = useStyles(stylesheet)
  const { title: headerBackTitle } = useTab()
  const { feedId: feedIdList, title: headerTitle } = useLocalSearchParams<PageLocalSearchParams>()

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
      <EntryList feedIdList={feedIdList ?? []} />
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
