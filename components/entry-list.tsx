import { formatDistance } from 'date-fns'
import { eq } from 'drizzle-orm'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
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
import { useEntryList } from '~/hooks/use-entry-list'

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
            <View>
              {
                data?.image ? (
                  <Image
                    source={{ uri: data?.image ?? '' }}
                    style={{ width: 24, height: 24, borderRadius: 24 / 4 }}
                  />
                ) : <SiteIcon source={data?.siteUrl} />
              }
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 8 / 2,
                  backgroundColor: entry?.read ? 'transparent' : theme.colors.accent10,
                  position: 'absolute',
                  left: -5,
                }}
              />
            </View>
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

export function EntryList({ feedIdList }: { feedIdList: string[] }) {
  const checkedEntryIdList = useRef(new Set<string>())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: entryList } = useEntryList(feedIdList)

  useEffect(() => {
    if (entryList && entryList.length === 0) {
      fetchAndUpdateEntriesInDB({
        feedIdList,
      })
        .catch(console.error)
    }
  }, [entryList])

  return (
    <>
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
