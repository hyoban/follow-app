import { formatDistance } from 'date-fns'
import { eq } from 'drizzle-orm'
import { Video } from 'expo-av'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { apiClient } from '~/api/client'
import { fetchAndUpdateEntriesInDB } from '~/api/entry'
import type { TabView } from '~/atom/layout'
import { Column, Container, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { db } from '~/db'
import type { Entry, Feed } from '~/db/schema'
import { entries } from '~/db/schema'
import { useEntryList } from '~/hooks/use-entry-list'

type EntryItemProps = {
  entry: Entry & { feed: Feed }
  options?: {
    hideImage?: boolean
    hideDescription?: boolean
    hideSiteIcon?: boolean
    hideDivider?: boolean
    noTruncation?: boolean
    imageNewLine?: boolean
  }
}

function getEntryItemPropsByView(view?: TabView): EntryItemProps['options'] {
  switch (view) {
    case 1: {
      return {
        hideDivider: true,
        noTruncation: true,
        imageNewLine: true,
      }
    }
    case 4: {
      return {
        hideDescription: true,
        hideSiteIcon: true,
      }
    }
    case 5: {
      return {
        hideImage: true,
        hideDescription: true,
      }
    }
    default: {
      return {}
    }
  }
}

function SiteImage({ feed, size = 24 }: { feed: Feed, size?: number }) {
  return feed?.image
    ? (
        <Image
          source={{ uri: feed.image }}
          style={{ width: size, height: size, borderRadius: size / 4 }}
        />
      )
    : (
        <SiteIcon source={feed?.siteUrl} />
      )
}

function Dot({ show, size = 8 }: { show: boolean, size?: number }) {
  const { theme } = useStyles()
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.accent10,
        position: 'absolute',
        left: 5,
        top: 9,
        display: show ? 'flex' : 'none',
      }}
    />
  )
}

function EntryItem({ entry, options }: EntryItemProps) {
  const { feed } = entry
  return (
    <>
      <Link href={`/feed/detail/${entry.id}`} asChild>
        <Pressable>
          <Row px={15} py={12} gap={10}>
            {!options?.hideSiteIcon && <SiteImage feed={feed} />}
            <Dot show={!entry.read} />
            <Column gap={6} flex={1}>
              <Row gap={6}>
                <Text size={10}>{feed?.title}</Text>
                <Text size={10}>
                  {formatDistance(new Date(entry.publishedAt), new Date(), {
                    addSuffix: true,
                  })}
                </Text>
              </Row>
              <Row>
                <Text
                  style={{ flex: 1, flexWrap: 'wrap' }}
                  weight={600}
                  numberOfLines={options?.noTruncation ? undefined : 2}
                >
                  {entry.title}
                </Text>
              </Row>
              {!options?.hideDescription && (
                <Text
                  size={12}
                  numberOfLines={options?.noTruncation ? undefined : 3}
                >
                  {entry.description}
                </Text>
              )}
              {options?.imageNewLine && (
                <Row gap={10}>
                  {entry.media?.map(
                    media => media.type === 'photo'
                      ? (
                          <Image
                            key={media.url}
                            source={{ uri: media.url }}
                            style={{ width: 100, height: 100, borderRadius: 5 }}
                          />
                        )
                      : media.type === 'video'
                        ? (
                            <Video
                              key={media.url}
                              style={{ width: 100, height: 100 }}
                              source={{ uri: media.url }}
                            />
                          )
                        : null,
                  )}
                </Row>
              )}
            </Column>
            {options?.hideImage || options?.imageNewLine
              ? null
              : options?.hideSiteIcon
                ? (
                    <SiteImage feed={feed} size={60} />
                  )
                : entry.media && entry.media.find(media => media.type === 'photo')
                  ? (
                      <Image
                        source={{
                          uri: entry.media.find(media => media.type === 'photo')?.url,
                        }}
                        style={{ width: 50, height: 50, borderRadius: 5 }}
                      />
                    )
                  : null}
          </Row>
        </Pressable>
      </Link>
      {!options?.hideDivider && <Row w="100%" h={1} bg="component" />}
    </>
  )
}

export function EntryList({
  feedIdList,
  view,
}: {
  feedIdList: string[]
  view?: TabView
}) {
  const options = useMemo(() => getEntryItemPropsByView(view), [view])

  const checkedEntryIdList = useRef(new Set<string>())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: entryList } = useEntryList(feedIdList)

  useEffect(() => {
    if (entryList && entryList.length === 0) {
      fetchAndUpdateEntriesInDB({
        feedIdList,
      }).catch(console.error)
    }
  }, [entryList])

  return (
    <>
      <Container>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={entryList}
          renderItem={({ item }) => <EntryItem entry={item} options={options} />}
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
            }).catch(console.error)
          }}
          onViewableItemsChanged={async ({ viewableItems }) => {
            await Promise.all(
              viewableItems
                .filter(({ item }) => !checkedEntryIdList.current.has(item.id))
                .map(async ({ item }) => {
                  const res = await apiClient.entries.$get({
                    query: { id: item.id },
                  })
                  checkedEntryIdList.current.add(item.id)
                  if (res.data?.read !== item.read) {
                    await db
                      .update(entries)
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
