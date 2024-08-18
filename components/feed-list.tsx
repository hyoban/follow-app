import { useHeaderHeight } from '@react-navigation/elements'
import { useScrollToTop } from '@react-navigation/native'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'
import { Alert, Platform, Pressable } from 'react-native'
import ContextMenu from 'react-native-context-menu-view'
import Animated, {
  Easing,
  Keyframe,
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useStyles } from 'react-native-unistyles'

import { flagEntryReadStatus } from '~/api/entry'
import { deleteFeed, syncFeeds } from '~/api/feed'
import type { TabViewIndex } from '~/atom/layout'
import { atomWithStorage } from '~/atom/storage'
import { Iconify, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import type { Feed } from '~/db/schema'
import { useFeedList } from '~/hooks/use-feed-list'
import { useTabInfo } from '~/hooks/use-tab-info'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function FeedFolder({
  category,
  feedIdList,
  unread,
}: {
  category: string
  feedIdList: string[]
  unread: number
}) {
  const expandedSections = useAtomValue(expandedSectionsAtom)
  const handleToggle = useSetAtom(toggleExpandedSectionAtom)
  const isExpanded = expandedSections.includes(category)

  const rotate = useSharedValue(isExpanded ? '90deg' : '0deg')
  useEffect(
    () => {
      rotate.value = isExpanded ? '90deg' : '0deg'
    },
    [category],
  )
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: rotate.value }] }))

  const { view, title } = useTabInfo()

  return (
    <>
      <ContextMenuWrapper feedIdList={feedIdList}>
        <Link
          href={`/feed/group/${feedIdList.join('/')}?title=${encodeURIComponent(category)}&view=${view}&backTitle=${encodeURIComponent(title ?? '')}`}
          asChild
        >
          <Pressable onLongPress={() => {}} delayLongPress={250}>
            <Row gap={10} h={45} align="center" px={18}>
              <AnimatedPressable
                style={animatedStyle}
                onPress={() => {
                  handleToggle(category)
                    .catch(console.error)
                  rotate.value = withSpring(
                    isExpanded ? '0deg' : '90deg',
                    { duration: 500, dampingRatio: 1 },
                  )
                }}
              >
                <Iconify icon="mingcute:right-fill" />
              </AnimatedPressable>
              <Text style={{ flex: 1 }}>
                {category}
              </Text>
              {unread > 0 && (
                <Text>{unread}</Text>
              )}
            </Row>
          </Pressable>
        </Link>
      </ContextMenuWrapper>
      <Row h={1} bg="component" w="100%" />
    </>
  )
}

function ContextMenuWrapper({
  feedIdList,
  feed,
  children,
  ...rest
}: React.ComponentProps<typeof ContextMenu> & {
  feedIdList: string[]
  feed?: Feed
}) {
  return (
    <ContextMenu
      actions={[
        { title: 'Mark as Read', systemIcon: 'circlebadge.fill' },
        { title: 'Delete', systemIcon: 'trash.fill' },
      ].concat(
        feed?.errorAt ? [{ title: 'Show Error', systemIcon: 'exclamationmark.triangle.fill' }] : [],
      )}
      onPress={(e) => {
        switch (e.nativeEvent.index) {
          case 0: {
            flagEntryReadStatus({ feedId: feedIdList }).catch(console.error)
            break
          }
          case 1: {
            Alert.alert('Delete', 'Are you sure you want to delete this feed?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  Promise.all(
                    feedIdList.map(i => deleteFeed(i)),
                  )
                    .catch(console.error)
                },
              },
            ])
            break
          }
          case 2: {
            Alert.alert('Error', feed?.errorMessage ?? 'Unknown error')
            break
          }
          default: {
            break
          }
        }
      }}
      {...rest}
    >
      {children}
    </ContextMenu>
  )
}

function FeedItem({
  feed,
}: {
  feed: Feed
}) {
  const { view, title } = useTabInfo()
  const { theme } = useStyles()
  return (
    <>
      <ContextMenuWrapper
        feedIdList={[feed.id]}
        feed={feed}
      >
        <Link
          href={`/feed/group/${feed.id}?title=${encodeURIComponent(feed.title ?? '')}&view=${view}&backTitle=${encodeURIComponent(title ?? '')}`}
          asChild
        >
          <Pressable onLongPress={() => {}} delayLongPress={250}>
            <Row gap={10} h={45} align="center" px={18}>
              {feed.image ? (
                <Image
                  recyclingKey={feed.id}
                  source={{ uri: feed.image }}
                  style={{ width: 24, height: 24, borderRadius: 1000 }}
                />
              ) : (
                <SiteIcon source={feed.siteUrl} />
              )}
              <Row flex={1} align="center" gap={4}>
                <Text
                  numberOfLines={1}
                  style={{
                    ...(
                      feed.errorAt
                        ? {
                            color: theme.colors.red10,
                          }
                        : {}
                    ),
                  }}
                >
                  {feed.title}
                </Text>
                {feed.errorAt && (
                  <Iconify icon="mingcute:wifi-off-line" color={theme.colors.red10} />
                )}
              </Row>
              {feed.unread > 0 && (
                <Text>{feed.unread}</Text>
              )}
            </Row>
          </Pressable>
        </Link>
      </ContextMenuWrapper>
      <Row h={1} bg="component" w="100%" />
    </>
  )
}

function groupBy<T>(array: T[], key: (item: T) => string) {
  return array.reduce((acc, item) => {
    const group = key(item)
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group]?.push(item)
    return acc
  }, {} as Record<string, T[]>)
}

const enteringAnimation = new Keyframe({
  0: {
    opacity: 0,
    transform: [{
      translateY: -10,
    }],
  },
  0.5: {
    opacity: 0.5,
    transform: [{
      translateY: 5,
    }],
    easing: Easing.in(Easing.quad),
  },
  1: {
    opacity: 1,
    transform: [{
      translateY: 0,
    }],
  },
}).duration(10000)

const exitingAnimation = new Keyframe({
  0: {
    opacity: 1,
    transform: [{
      translateY: 0,
    }],
  },
  0.5: {
    opacity: 0.5,
    transform: [{
      translateY: 5,
    }],
    easing: Easing.out(Easing.quad),
  },
  1: {
    opacity: 0,
    transform: [{
      translateY: -10,
    }],
  },
}).duration(10000)

const expandedSectionsAtom = atomWithStorage<string[]>('expanded-sections', [])
const toggleExpandedSectionAtom = atom(null, async (get, set, update: string) => {
  const expandedSections = get(expandedSectionsAtom)
  if (expandedSections.includes(update)) {
    set(expandedSectionsAtom, expandedSections.filter(i => i !== update))
  }
  else {
    set(expandedSectionsAtom, [...expandedSections, update])
  }
})

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getFeedCategory(feed: Feed) {
  return feed.category || (feed.siteUrl ? capitalizeFirstLetter((new URL(feed.siteUrl)).host.split('.').slice(-2).join('.')) : '')
}

function isSingleCategory(feeds: Feed[]) {
  return feeds.length <= 1 && !feeds.every(i => i.category)
}

export function FeedList({ view }: { view: TabViewIndex }) {
  const headerHeight = useHeaderHeight()
  const ref = useRef<Animated.FlatList<unknown>>(null)
  useScrollToTop(
    useRef({
      scrollToTop: () => {
        ref.current?.scrollToOffset({
          offset: Platform.select({ ios: -headerHeight, android: 0 }) ?? 0,
          animated: true,
        })
        syncFeeds()
          .catch(console.error)
      },
    }),
  )

  const { data: feeds } = useFeedList(view)
  const feedsGrouped = useMemo(
    () => groupBy(feeds ?? [], getFeedCategory),
    [feeds],
  )

  const data = useMemo(
    () => Array.from(
      Object.entries(feedsGrouped),
      ([title, data]) => isSingleCategory(data)
        ? [data]
        : [
            title,
            data.sort((a, b) => b.unread - a.unread),
          ],
    )
      .sort((a, b) => {
        const unreadA = Array.isArray(a[0]) ? a[0].reduce((acc, sub) => acc + sub.unread, 0) : Array.isArray(a[1]) ? a[1].reduce((acc, sub) => acc + sub.unread, 0) : 0
        const unreadB = Array.isArray(b[0]) ? b[0].reduce((acc, sub) => acc + sub.unread, 0) : Array.isArray(b[1]) ? b[1].reduce((acc, sub) => acc + sub.unread, 0) : 0
        return unreadB - unreadA
      })
      .flat(),
    [feedsGrouped],
  )

  const expandedSections = useAtomValue(expandedSectionsAtom)

  return (
    <Animated.FlatList
      scrollToOverflowEnabled
      contentInsetAdjustmentBehavior="automatic"
      ref={ref}
      style={{ width: '100%' }}
      data={data}
      extraData={expandedSections}
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return item === ''
            ? null
            : (
                <FeedFolder
                  category={item}
                  feedIdList={feedsGrouped[item]?.map(i => i.id) ?? []}
                  unread={feedsGrouped[item]?.reduce((acc, sub) => acc + sub.unread, 0) ?? 0}
                />
              )
        }
        if (!item[0]) {
          return null
        }
        const category = getFeedCategory(item[0])
        const shouldShow = expandedSections.includes(category) || isSingleCategory(item)
        if (!shouldShow) {
          return null
        }
        return (
          <LayoutAnimationConfig skipEntering={!item[0].category}>
            <Animated.View
              entering={enteringAnimation}
              exiting={exitingAnimation}
            >
              {item.map(i => (<FeedItem key={i.id} feed={i} />))}
            </Animated.View>
          </LayoutAnimationConfig>
        )
      }}
    />
  )
}
