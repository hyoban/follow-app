import { formatDistance } from 'date-fns'
import { eq } from 'drizzle-orm'
import { Image } from 'expo-image'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { apiClient } from '~/api/client'
import { fetchAndUpdateEntriesInDB } from '~/api/entry'
import { Column, Container, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { db } from '~/db'
import type { Entry, Feed } from '~/db/schema'
import { entries } from '~/db/schema'
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
  const [title] = useTabTitle()
  const checkedEntryIdList = useRef(new Set<string>())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { theme } = useStyles()
  const { feedId: feedIdList } = useLocalSearchParams<{ feedId: string[] }>()

  const { data: entryList } = useQuerySubscription(
    db.query.entries.findMany({
      where(fields, operators) {
        return operators.inArray(fields.feedId, feedIdList ?? [])
      },
      orderBy(fields, { desc }) {
        return [desc(fields.publishedAt)]
      },
      with: {
        feed: true,
      },
    }),
    ['entries', feedIdList],
  )

  useEffect(() => {
    if (entryList && entryList.length === 0) {
      fetchAndUpdateEntriesInDB({
        feedIdList,
      })
        .catch(console.error)
    }
  }, [entryList])

  if (!feedIdList) {
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
            setIsRefreshing(true)
            checkedEntryIdList.current.clear()
            fetchAndUpdateEntriesInDB({
              feedIdList,
              publishedBefore: entryList?.at(0)?.publishedAt,
            })
              .catch(console.error)
              .finally(() => setIsRefreshing(false))
          }}
          onEndReached={() => {
            fetchAndUpdateEntriesInDB({
              feedIdList,
              publishedAfter: entryList?.at(-1)?.publishedAt,
            })
              .catch(console.error)
          }}
          onViewableItemsChanged={async ({ viewableItems }) => {
            await Promise.all(
              viewableItems
                .filter(({ item }) => !checkedEntryIdList.current.has(item.id))
                .map(async ({ item }) => {
                  const res = await apiClient.entries.$get({ query: { id: item.id } })
                  checkedEntryIdList.current.add(item.id)
                  if (res.data?.read !== item.read) {
                    await db.update(entries)
                      .set({ read: res.data?.read ?? false })
                      .where(eq(entries.id, item.id))
                  }
                }),
            )
          }}
        />
      </Container>
    </>
  )
}
