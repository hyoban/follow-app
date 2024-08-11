import { useHeaderHeight } from '@react-navigation/elements'
import { useScrollToTop } from '@react-navigation/native'
import type { FlashList } from '@shopify/flash-list'
import { MasonryFlashList } from '@shopify/flash-list'
import { formatDistanceToNowStrict } from 'date-fns'
import { Image } from 'expo-image'
import { Link, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import ContextMenu from 'react-native-context-menu-view'
import TrackPlayer, { usePlaybackState } from 'react-native-track-player'
import { useStyles } from 'react-native-unistyles'

import { checkNotExistEntries, flagEntryReadStatus } from '~/api/entry'
import { showUnreadOnlyAtom } from '~/atom/entry-list'
import type { TabViewIndex } from '~/atom/layout'
import { Column, Iconify, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { blurhash } from '~/consts/blur'
import { FETCH_PAGE_SIZE } from '~/consts/limit'
import type { Entry, Feed } from '~/db/schema'
import { useEntryList } from '~/hooks/use-entry-list'
import { useTabInfo } from '~/hooks/use-tab-info'
import { getDeepLinkUrl, openExternalUrl } from '~/lib/utils'

import { LoadingIndicator } from './loading-indicator'
import { RefreshIndicator } from './refresh-indicator'

type EntryItemProps = {
  entry: Entry & { feed: Feed }
  index?: number
}

function getEntryItemPropsByView(view?: TabViewIndex): {
  hideImage?: boolean
  hideDescription?: boolean
  hideSiteIcon?: boolean
  hideDivider?: boolean
  noTruncation?: boolean
  imageNewLine?: boolean
} {
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

function EntryItem({ entry }: EntryItemProps) {
  const { feed } = entry
  const { view, title } = useTabInfo()
  const options = useMemo(() => getEntryItemPropsByView(view), [view])
  const { feedIdList } = useContext(FeedIdList)
  return (
    <>
      <ContextMenu
        actions={[
          entry.read
            ? { title: 'Mark as Unread', systemIcon: 'circlebadge' }
            : { title: 'Mark as Read', systemIcon: 'circlebadge.fill' },
        ]}
        onPress={(e) => {
          switch (e.nativeEvent.index) {
            case 0: {
              flagEntryReadStatus({ entryId: entry.id, read: !entry.read })
                .catch(console.error)
              break
            }
            default: {
              break
            }
          }
        }}
      >
        <Link
          href={`/feed/detail/${entry.id}?feedId=${feedIdList ? feedIdList.join(',') : feed.id}&title=${title}&view=${view}` as any}
          asChild
        >
          <Pressable onLongPress={() => {}}>
            <Row px={15} py={12} gap={10}>
              {!options?.hideSiteIcon && <SiteImage feed={feed} />}
              <Dot show={!entry.read} />
              <Column gap={6} flex={1}>
                <Row gap={6}>
                  <Text size={10}>
                    {feed?.title}
                  </Text>
                  <Text size={10}>
                    {formatDistanceToNowStrict(new Date(entry.publishedAt))}
                  </Text>
                </Row>
                <Row>
                  <Text
                    size={16}
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
                    {entry.media?.map((media, index) => (
                      <Image
                        key={index}
                        source={{ uri: media.type === 'photo' ? media.url : media.preview_image_url }}
                        style={{
                          width: 100,
                          // height: 100,
                          aspectRatio: (media.width && media.height) ? media.width / media.height : 1,
                          borderRadius: 5,
                        }}
                      />
                    ))}
                  </Row>
                )}
              </Column>
              {options?.hideImage || options?.imageNewLine
                ? null
                : options?.hideSiteIcon
                  ? (
                      <AudioButton
                        entry={entry}
                      >
                        <SiteImage feed={feed} size={60} />
                      </AudioButton>
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
      </ContextMenu>

      {!options?.hideDivider && <Row w="100%" h={1} bg="component" />}
    </>
  )
}

type AudioButtonProps = EntryItemProps & {
  children?: React.ReactNode
}

function AudioButton({ entry, children }: AudioButtonProps) {
  const attachment = entry?.attachments?.find(attachment => attachment.mime_type?.startsWith('audio'))
  const playerState = usePlaybackState()
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = async () => {
    if (!attachment)
      return

    const currentTrack = await TrackPlayer.getActiveTrack()
    if (attachment.url === currentTrack?.url) {
      await TrackPlayer.reset()
      setIsPlaying(false)
      return
    }

    if (playerState.state === 'playing') {
      await TrackPlayer.reset()
    }

    await TrackPlayer.add({
      url: attachment.url,
      title: entry?.title ?? 'No title',
      artwork: entry?.feed.image ?? undefined,
    })
    await TrackPlayer.play()
    setIsPlaying(true)
  }

  if (!attachment)
    return <>{children}</>

  return (
    <Pressable onPress={playAudio}>
      {children}
      {
        isPlaying
          ? (
              <Iconify
                icon="carbon:stop-filled"
                size={24}
                color="white"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 5,
                }}
              />
            )
          : (
              <Iconify
                icon="carbon:play-filled"
                size={24}
                color="white"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 5,
                }}
              />
            )
      }
    </Pressable>
  )
}

function RenderItem({ entry, index }: EntryItemProps) {
  const { view } = useTabInfo()
  return view === 2 || view === 3
    ? <EntryMedia entry={entry} props={{ isVideo: view === 3 }} index={index} />
    : <EntryItem entry={entry} index={index} />
}

const FeedIdList = createContext<{ feedIdList: string[] }>({ feedIdList: [] })

export function EntryList({
  feedIdList,
}: {
  feedIdList: string[]
}) {
  const feedIdListRef = useRef(feedIdList)
  useEffect(() => {
    feedIdListRef.current = feedIdList
  }, [feedIdList])

  const headerHeight = useHeaderHeight()
  const [limit, setLimit] = useState(FETCH_PAGE_SIZE)
  const { data: dataInDb } = useEntryList(feedIdList)
  const data = useMemo(() => dataInDb?.slice(0, limit), [dataInDb, limit])

  const renderItem = useCallback(
    ({ item, index }: { item: Entry & { feed: Feed }, index: number }) => <RenderItem entry={item} index={index} />,
    [],
  )

  const lastItemPublishedAt = useRef<string>()
  const flashListRef = useRef<FlashList<Entry & { feed: Feed }> | null>(null)
  const showUnreadOnly = useAtomValue(showUnreadOnlyAtom)
  const resetCursor = useCallback(() => {
    lastItemPublishedAt.current = undefined
    flashListRef.current?.scrollToOffset({ offset: -headerHeight, animated: true })
  }, [headerHeight])
  useScrollToTop(
    useRef({
      scrollToTop: () => {
        refresh({ updateLimit: 'reset' })
      },
    }),
  )
  useEffect(() => {
    resetCursor()
  }, [resetCursor, showUnreadOnly])

  const [canLoadMore, setCanLoadMore] = useState(true)

  const load = useCallback((props: { updateLimit: 'increase' | 'reset', hideGlobalLoading?: boolean }) => {
    const { updateLimit, hideGlobalLoading } = props
    checkNotExistEntries(
      {
        feedIdList: feedIdListRef.current,
        start: lastItemPublishedAt.current,
        hideGlobalLoading,
      },
    )
      .then((publishedAt) => {
        lastItemPublishedAt.current = publishedAt
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        if (updateLimit === 'reset') {
          setCanLoadMore(true)
          setLimit(FETCH_PAGE_SIZE)
        }
      })
    if (updateLimit === 'increase')
      setLimit(limit => limit + FETCH_PAGE_SIZE)
  }, [])
  const refresh = useCallback((props: { updateLimit: 'increase' | 'reset', hideGlobalLoading?: boolean }) => {
    setCanLoadMore(false)
    resetCursor()
    load(props)
  }, [load, resetCursor])

  useEffect(() => {
    if (!lastItemPublishedAt.current && feedIdList.length > 0) {
      refresh({ updateLimit: 'reset' })
    }
  }, [feedIdList.length, refresh])

  const { view } = useTabInfo()

  return (
    <>
      <FeedIdList.Provider value={{ feedIdList }}>
        <MasonryFlashList
          numColumns={view === 2 ? 2 : 1}
          scrollToOverflowEnabled
          ref={flashListRef}
          contentInsetAdjustmentBehavior="automatic"
          estimatedItemSize={80}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (canLoadMore) {
              load({ updateLimit: 'increase' })
            }
          }}
          ListFooterComponent={() => <LoadingIndicator style={{ marginVertical: 10 }} />}
        />
      </FeedIdList.Provider>
      <RefreshIndicator
        feedIdList={feedIdList}
        onRefresh={() => refresh({ updateLimit: 'reset' })}
      />
    </>
  )
}

function EntryMedia({ entry, props, index }: Omit<EntryItemProps, 'props'> & { props?: { isVideo?: boolean } }) {
  const { isVideo } = props ?? {}
  const media = entry.media?.find(media => media.type === 'photo')
  const { feedIdList } = useContext(FeedIdList)
  const router = useRouter()
  const { theme } = useStyles()
  const { title, view } = useTabInfo()
  return (
    <Pressable
      onPress={() => {
        if (isVideo && entry.url) {
          openExternalUrl(getDeepLinkUrl(entry.url), { inApp: false })
            .catch(console.error)
        }
        else {
          router.push(`/feed/detail/${entry.id}?feedId=${feedIdList ? feedIdList.join(',') : entry.feedId}&title=${title}&view=${view}` as any)
        }
      }}
      style={isVideo ? {} : {
        margin: 5,
        marginLeft: index !== undefined ? index % 2 === 1 ? 5 : 10 : 5,
        marginRight: index !== undefined ? index % 2 === 1 ? 10 : 5 : 5,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: theme.colors.gray2,
      }}
    >
      <Column>
        {media && (
          <Image
            source={{ uri: media?.url.startsWith('http') ? media.url.replace('http://', 'https://') : media?.url }}
            style={{
              width: '100%',
              aspectRatio: (media?.height && media.width)
                ? media.width / media.height
                : isVideo ? 16 / 9 : 9 / 16,
            }}
            placeholder={{ blurhash }}
          />
        )}
        <Column p={10} gap={10}>
          {entry.title && (
            <Text weight="600" numberOfLines={1}>
              {entry.title}
            </Text>
          )}
          <Row align="center" gap={4}>
            <SiteImage feed={entry.feed} size={16} />
            <Text size={12} numberOfLines={1}>
              {entry.feed.title}
            </Text>
            {isVideo && (
              <Text size={12}>
                {formatDistanceToNowStrict(new Date(entry.publishedAt))}
              </Text>
            )}
          </Row>
        </Column>
      </Column>
    </Pressable>
  )
}
