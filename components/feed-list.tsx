import { useHeaderHeight } from '@react-navigation/elements'
import { useScrollToTop } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { atom, getDefaultStore, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'
import { Alert, FlatList, Platform, Pressable } from 'react-native'
import ContextMenu from 'react-native-context-menu-view'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useStyles } from 'react-native-unistyles'
import { unstable_serialize } from 'swr'

import { flagEntryReadStatus } from '~/api/entry'
import { deleteFeed, syncFeeds } from '~/api/feed'
import { Iconify, Row, Text } from '~/components'
import { Image } from '~/components/image'
import { SiteIcon } from '~/components/site-icon'
import type { Feed } from '~/db/schema'
import { useFeedList } from '~/hooks/use-feed-list'
import { useTabInfo } from '~/hooks/use-tab-info'
import { useFeedIdListMapStore } from '~/store/feed'
import type { TabViewIndex } from '~/store/layout'
import { atomWithStorage } from '~/store/storage'
import { isTablet } from '~/theme/breakpoints'

import { ListEmpty } from './list-empty'

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
      const store = getDefaultStore()
      const isExpanded = store.get(expandedSectionsAtom).includes(category)
      rotate.value = isExpanded ? '90deg' : '0deg'
    },
    [category, rotate],
  )
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: rotate.value }] }))

  const { view, title } = useTabInfo()
  const { breakpoint, theme } = useStyles()
  const router = useRouter()
  const selectedFeedIdList = useFeedIdListMapStore(state => state.feedIdListMap[view!])
  const update = useFeedIdListMapStore(state => state.updateFeedIdListMap)
  const showBackGround = selectedFeedIdList.length > 0 && unstable_serialize(selectedFeedIdList) === unstable_serialize(feedIdList)

  return (
    <>
      <ContextMenuWrapper feedIdList={feedIdList}>
        <Pressable
          onPress={() => {
            if (isTablet(breakpoint)) {
              if (view !== undefined) {
                update(view, feedIdList)
              }
              return
            }
            router.push(`/feed/group/${feedIdList.join('/')}?title=${encodeURIComponent(category)}&view=${view}&backTitle=${encodeURIComponent(title ?? '')}`)
          }}
          onLongPress={() => {}}
          delayLongPress={250}
          style={{
            backgroundColor: showBackGround
              ? theme.colors.gray3
              : undefined,
          }}
        >
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
  const { theme, breakpoint } = useStyles()
  const router = useRouter()
  const selectedFeedIdList = useFeedIdListMapStore(state => state.feedIdListMap[view!])
  const update = useFeedIdListMapStore(state => state.updateFeedIdListMap)
  const showBackGround = selectedFeedIdList.length > 0 && selectedFeedIdList.at(-1) === feed.id
  return (
    <>
      <ContextMenuWrapper
        feedIdList={[feed.id]}
        feed={feed}
      >
        <Pressable
          onPress={() => {
            if (isTablet(breakpoint)) {
              if (view !== undefined) {
                update(view, [feed.id])
              }
              return
            }
            router.push(`/feed/group/${feed.id}?title=${encodeURIComponent(feed.title ?? '')}&view=${view}&backTitle=${encodeURIComponent(title ?? '')}`)
          }}
          onLongPress={() => {}}
          delayLongPress={250}
          style={{
            backgroundColor: showBackGround
              ? theme.colors.gray3
              : undefined,
          }}
        >
          <Row gap={10} h={45} align="center" px={18}>
            {feed.image ? (
              <Image
                recyclingKey={feed.id}
                source={feed.image}
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
      .flatMap(i => (Array.isArray(i[1]) ? [i[0], ...i[1]] : i[0]))
    ,
    [feedsGrouped],
  )

  const expandedSections = useAtomValue(expandedSectionsAtom)

  return (
    <FlatList
      scrollToOverflowEnabled
      contentInsetAdjustmentBehavior="automatic"
      ref={ref}
      style={{ width: '100%' }}
      data={data}
      extraData={expandedSections}
      renderItem={({ item: feedOrCategory }) => {
        const item = feedOrCategory as Feed | string

        if (typeof item === 'string') {
          return (
            <FeedFolder
              category={item}
              feedIdList={feedsGrouped[item]?.map(i => i.id) ?? []}
              unread={feedsGrouped[item]?.reduce((acc, sub) => acc + sub.unread, 0) ?? 0}
            />
          )
        }
        const category = getFeedCategory(item)
        const shouldShow = expandedSections.includes(category) || (feedsGrouped[category] && isSingleCategory(feedsGrouped[category]))
        if (!shouldShow) {
          return null
        }
        return <FeedItem feed={item} />
      }}
      ListEmptyComponent={ListEmpty}
    />
  )
}
