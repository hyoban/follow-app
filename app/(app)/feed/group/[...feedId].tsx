import { Stack, useLocalSearchParams } from 'expo-router'
import { useStyles } from 'react-native-unistyles'

import { Container } from '~/components'
import { EntryList } from '~/components/entry-list'
import { UnreadFilter } from '~/components/unread-filter'
import { useTabInfo } from '~/hooks/use-tab-info'
import { commonStylesheet } from '~/theme/common'

type PageLocalSearchParams = {
  feedId: string[]
  title: string
  view: string
}

export default function Page() {
  const { styles } = useStyles(commonStylesheet)
  const { title: headerBackTitle } = useTabInfo()
  const { feedId: feedIdList, title: headerTitle } = useLocalSearchParams<PageLocalSearchParams>()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle,
          headerBackTitle,
          headerTitleStyle: styles.highContrastText,
          headerStyle: styles.subtleBackground,
          headerRight: () => <UnreadFilter feedIdList={feedIdList ?? []} />,
        }}
      />
      <Container>
        <EntryList feedIdList={feedIdList ?? []} />
      </Container>
    </>
  )
}
