import { FlashList } from '@shopify/flash-list'
import { formatDistance } from 'date-fns'
import { Video } from 'expo-av'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import TrackPlayer, { usePlaybackState } from 'react-native-track-player'
import { useStyles } from 'react-native-unistyles'

import { checkNotExistEntries } from '~/api/entry'
import type { TabViewIndex } from '~/atom/layout'
import { Column, Iconify, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { FETCH_PAGE_SIZE } from '~/consts/limit'
import type { Entry, Feed } from '~/db/schema'
import { useEntryList } from '~/hooks/use-entry-list'
import { useTabInfo } from '~/hooks/use-tab-info'

type EntryItemProps = {
  entry: Entry & { feed: Feed }
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
  const { view } = useTabInfo()
  const options = useMemo(() => getEntryItemPropsByView(view), [view])
  const { feedIdList } = useContext(FeedIdList)
  return (
    <>
      <Link
        href={`/feed/detail/${entry.id}?feedId=${feedIdList ? feedIdList.join(',') : feed.id}` as any}
        asChild
      >
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
                  {entry.media?.map((media, index) =>
                    media.type === 'photo'
                      ? (
                          <Image
                            key={index}
                            source={{ uri: media.url }}
                            style={{ width: 100, height: 100, borderRadius: 5 }}
                          />
                        )
                      : media.type === 'video'
                        ? (
                            <Video
                              key={index}
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

function RenderItem({ entry }: EntryItemProps) {
  const { view } = useTabInfo()
  return view === 2 || view === 3
    ? <EntryMedia entry={entry} props={{ isVideo: view === 3 }} />
    : <EntryItem entry={entry} />
}

const FeedIdList = createContext<{ feedIdList: string[] }>({ feedIdList: [] })

export function EntryList({
  feedIdList,
}: {
  feedIdList: string[]
}) {
  const [limit, setLimit] = useState(FETCH_PAGE_SIZE)
  const { data: dataInDb } = useEntryList(feedIdList)
  const data = useMemo(() => dataInDb?.slice(0, limit), [dataInDb, limit])

  const renderItem = useCallback(
    ({ item }: { item: Entry & { feed: Feed } }) => <RenderItem entry={item} />,
    [],
  )

  const onceRef = useRef(false)

  useEffect(() => {
    if (data?.at(-1)?.publishedAt && !onceRef.current) {
      onceRef.current = true
      checkNotExistEntries(
        feedIdList,
        data?.at(-1)?.publishedAt,
      )
        .catch((error) => {
          console.error(error)
        })
    }
  }, [data, feedIdList])

  return (
    <FeedIdList.Provider value={{ feedIdList }}>
      <FlashList
        estimatedItemSize={150}
        contentInsetAdjustmentBehavior="automatic"
        data={data}
        renderItem={renderItem}
        onEndReachedThreshold={10}
        onEndReached={() => {
          checkNotExistEntries(
            feedIdList,
            data?.at(-1)?.publishedAt,
            data?.at(-20)?.publishedAt,
          )
            .catch((error) => {
              console.error(error)
            })
          setLimit(limit + FETCH_PAGE_SIZE)
        }}
      />
    </FeedIdList.Provider>
  )
}

function EntryMedia({ entry, props }: Omit<EntryItemProps, 'props'> & { props?: { isVideo?: boolean } }) {
  const { isVideo } = props ?? {}
  const uri = entry.media?.find(media => media.type === 'photo')?.url
  return (
    <Column>
      <Image
        source={{ uri: uri?.startsWith('http') ? uri.replace('http://', 'https://') : uri }}
        style={{ width: '100%', aspectRatio: isVideo ? 16 / 9 : 1 }}
      />
      <Column p={10} gap={10}>
        <Text weight="600">
          {entry.title}
        </Text>
        <Row align="center" gap={4}>
          <SiteImage feed={entry.feed} size={16} />
          <Text size={12}>
            {entry.feed.title}
          </Text>
          <Text size={12}>
            {formatDistance(new Date(entry.publishedAt), new Date(), {
              addSuffix: true,
            })}
          </Text>
        </Row>
      </Column>
    </Column>
  )
}
