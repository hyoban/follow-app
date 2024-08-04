import { Stack, useLocalSearchParams } from 'expo-router'
import { useStyles } from 'react-native-unistyles'

import { Container, Row } from '~/components'
import { EntryList } from '~/components/entry-list'
import { LoadingIndicator } from '~/components/loading-indicator'
import { UnreadFilter } from '~/components/unread-filter'
import { commonStylesheet } from '~/theme/common'

type PageLocalSearchParams = {
  feedId: string[]
  title: string
  view: string
  backTitle: string
}

export default function Page() {
  const { styles } = useStyles(commonStylesheet)

  const {
    feedId: feedIdList,
    title: headerTitle,
    backTitle: headerBackTitle,
  } = useLocalSearchParams<PageLocalSearchParams>()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle,
          headerBackTitle,
          headerTitleStyle: styles.highContrastText,
          headerStyle: styles.subtleBackground,
          headerRight: () => (
            <Row gap={18} style={styles.subtleBackground}>
              <LoadingIndicator />
              <UnreadFilter />
            </Row>
          ),
        }}
      />
      <Container>
        <EntryList feedIdList={feedIdList ?? []} />
      </Container>
    </>
  )
}
