import { formatDistance } from 'date-fns'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { apiClient } from '~/api/client'
import { createOrUpdateEntriesInDB } from '~/api/entry'
import { Column, Container, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { db } from '~/db'
import type { Entry } from '~/db/schema'

function EntryItem({ entry }: { entry: Entry }) {
  const { data } = useLiveQuery(
    db.query.feeds.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, entry.feedId)
      },
    }),
  )
  return (
    <>
      <Row
        px={15}
        py={12}
        gap={10}
      >
        {
          data?.image
            ? (
                <Image
                  source={{ uri: data?.image ?? '' }}
                  style={{ width: 24, height: 24, borderRadius: 24 / 4 }}
                />
              ) : <SiteIcon source={data?.siteUrl} />
        }

        <Column gap={6} flex={1}>
          <Row>
            <Text style={{ flex: 1, flexWrap: 'wrap' }}>
              {entry.title}
            </Text>
          </Row>
          <Row gap={6}>
            <Text size={12}>{data?.title}</Text>
            <Text size={12}>
              {formatDistance(
                new Date(entry.publishedAt),
                new Date(),
                { addSuffix: true },
              )}
            </Text>
          </Row>
        </Column>
        {entry.media
        && entry.media.find(media => media.type === 'photo')
        && (
          <Image
            source={{ uri: entry.media.find(media => media.type === 'photo')?.url }}
            style={{ width: 50, height: 50 }}
          />
        )}
      </Row>
      <Row
        w="100%"
        h={1}
        bg="component"
      />
    </>
  )
}

export default function Page() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { theme } = useStyles()
  const { feedId } = useLocalSearchParams()
  const feedIdList = !feedId ? [] : Array.isArray(feedId) ? feedId : [feedId]

  const { data: entryList } = useLiveQuery(
    db.query.entries.findMany({
      where(fields, operators) {
        return operators.inArray(fields.feedId, feedIdList)
      },
    }),
  )

  if (!feedId) {
    return null
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Feed',
          headerBackTitle: 'Back',
          headerTitleStyle: {
            color: theme.colors.gray12,
          },
          headerStyle: {
            backgroundColor: theme.colors.gray2,
          },
        }}
      />
      <Container>
        <FlatList
          data={entryList}
          renderItem={({ item }) => <EntryItem entry={item} />}
          refreshing={isRefreshing}
          onRefresh={async () => {
            setIsRefreshing(true);
            // @ts-expect-error
            (apiClient.entries['check-new'].$get({
              query: {
                feedIdList: [...feedIdList, ...feedIdList],
                insertedAfter: Date.now() - 1000 * 60 * 60 * 24,
              },
            }) as Promise<{ data: {
              has_new: boolean
              lastest_at?: string
            } }>)
              .then(({ data }) => {
                const { lastest_at } = data
                const lastestAt = lastest_at ? new Date(lastest_at) : new Date()
                const newest = new Date(entryList.at(0)?.publishedAt ?? 0)
                if (lastestAt > newest || entryList.length === 0) {
                  createOrUpdateEntriesInDB({
                    feedIdList,
                  })
                    .catch(console.error)
                }
              })
              .catch(console.error)
              .finally(() => setIsRefreshing(false))
          }}
        />
      </Container>
    </>
  )
}
