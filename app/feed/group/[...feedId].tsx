import { formatDistance } from 'date-fns'
import { Image } from 'expo-image'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { apiClient } from '~/api/client'
import { createOrUpdateEntriesInDB } from '~/api/entry'
import { Column, Container, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { db } from '~/db'
import type { Entry, Feed } from '~/db/schema'
import { useQuerySubscription } from '~/hooks/use-query-subscription'
import { useTabTitle } from '~/hooks/use-tab-title'

function EntryItem({ entry }: { entry: Entry & { feed: Feed } }) {
  const { theme } = useStyles()
  const data = entry.feed
  return (
    <>
      <Link href={`/feed/detail/${entry.id}`} asChild>
        <Pressable>
          <Row
            px={15}
            py={12}
            gap={10}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8 / 2,
                backgroundColor: entry?.read ? 'transparent' : theme.colors.accent10,
              }}
            />
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
              <Row gap={6}>
                <Text size={10}>{data?.title}</Text>
                <Text size={10}>
                  {formatDistance(
                    new Date(entry.publishedAt),
                    new Date(),
                    { addSuffix: true },
                  )}
                </Text>
              </Row>
              <Row>
                <Text style={{ flex: 1, flexWrap: 'wrap' }} weight={600}>
                  {entry.title}
                </Text>
              </Row>
              <Text
                size={12}
                numberOfLines={3}
              >
                {entry.description}
              </Text>
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
        </Pressable>
      </Link>
      <Row
        w="100%"
        h={1}
        bg="component"
      />
    </>
  )
}

export default function Page() {
  const title = useTabTitle()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const { theme } = useStyles()
  const { feedId } = useLocalSearchParams()
  const feedIdList = !feedId ? [] : Array.isArray(feedId) ? feedId : [feedId]

  const { data: entryList } = useQuerySubscription(
    db.query.entries.findMany({
      where(fields, operators) {
        return operators.inArray(fields.feedId, feedIdList)
      },
      with: {
        feed: true,
      },
    }),
    ['entries', feedIdList],
  )

  if (!feedId) {
    return null
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: entryList?.at(0)?.feed.category ?? entryList?.at(0)?.feed.title ?? 'Feed',
          headerBackTitle: title,
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
                const newest = new Date(entryList?.at(0)?.publishedAt ?? 0)
                if (lastestAt > newest || entryList?.length === 0) {
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
