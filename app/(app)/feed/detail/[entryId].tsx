import { inArray } from 'drizzle-orm'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import PagerView from 'react-native-pager-view'
import { useStyles } from 'react-native-unistyles'

import { loadEntryContent, markEntryAsRead } from '~/api/entry'
import { Column, Container, Text } from '~/components'
import { db } from '~/db'
import { entries } from '~/db/schema'
import { useQuerySubscription } from '~/hooks/use-query-subscription'

export default function FeedDetail() {
  const { entryId, feedId } = useLocalSearchParams<{ entryId: string, feedId: string }>()
  const feedIdList = feedId.split(',')
  const { data: entryList } = useQuerySubscription(
    db.query.entries.findMany({
      where: inArray(entries.feedId, feedIdList),
      orderBy(fields, { desc }) {
        return [desc(fields.publishedAt)]
      },
      with: {
        feed: true,
      },
    }),
    [feedId, entryId],
  )
  const { theme } = useStyles()
  const data = entryList?.find(entry => entry.id === entryId)

  useEffect(() => {
    if (data && !data.content) {
      loadEntryContent(entryId!)
        .catch(console.error)
    }
    if (data && !data.read) {
      markEntryAsRead(entryId!, data.feed)
        .catch(console.error)
    }
  }, [data])

  if (!entryId || typeof entryId !== 'string')
    return null

  return (
    <>
      <Stack.Screen options={{
        headerTitle: '',
        headerStyle: {
          backgroundColor: theme.colors.gray2,
        },
        headerTitleStyle: {
          color: theme.colors.gray12,
        },
      }}
      />

      <Container style={{ backgroundColor: theme.colors.gray1 }}>
        <PagerView
          style={{ flex: 1 }}
          initialPage={entryList?.findIndex(i => i.id === data?.id)}
        >
          {entryList?.map(entry => (
            <Column key={entry.id} p={20}>
              <Text size={20} weight={600}>
                {entry?.title}
              </Text>
            </Column>
          ))}
        </PagerView>
      </Container>
    </>
  )
}
