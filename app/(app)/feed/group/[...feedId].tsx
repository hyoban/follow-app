import { Stack, useLocalSearchParams } from 'expo-router'
import { Platform } from 'react-native'

import { Container, Row } from '~/components'
import { EntryList } from '~/components/entry-list'
import { MarkAsRead } from '~/components/mark-as-read'
import { UnreadFilter } from '~/components/unread-filter'

type PageLocalSearchParams = {
  feedId: string[]
  title: string
  view: string
  backTitle: string
  collected?: string
}

export default function Page() {
  const {
    feedId: feedIdList,
    title: headerTitle,
    backTitle: headerBackTitle,
    collected,
  } = useLocalSearchParams<PageLocalSearchParams>()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle,
          headerBackTitle,
          headerBlurEffect: 'regular',
          headerTransparent: Platform.select({
            ios: true,
            default: false,
          }),
          headerRight: () => (
            <Row gap={14}>
              <UnreadFilter />
              <MarkAsRead feedId={feedIdList} closeAfter />
            </Row>
          ),
        }}
      />
      <Container>
        <EntryList feedIdList={feedIdList ?? []} collectedOnly={collected === 'true'} />
      </Container>
    </>
  )
}
