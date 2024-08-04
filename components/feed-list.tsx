import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useMemo } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  Easing,
  Keyframe,
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

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
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: rotate.value }] }))

  const { view, title } = useTabInfo()

  return (
    <Link
      href={`/feed/group/${feedIdList.join('/')}?title=${encodeURIComponent(category)}&view=${view}$backTitle=${encodeURIComponent(title)}`}
      href={`/feed/group/${feedIdList.join('/')}?title=${encodeURIComponent(category)}&view=${view}&backTitle=${encodeURIComponent(title)}`}
      asChild
    >
      <Pressable>
        <Row gap={10} h={45} align="center">
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
          <Text style={{ flex: 1 }}>{category}</Text>
          {unread > 0 && (
            <Text>{unread}</Text>
          )}
        </Row>
        <Row h={1} bg="component" w="100%" />
      </Pressable>
    </Link>
  )
}

function FeedItem({
  feed,
}: {
  feed: Feed
}) {
  const { view, title } = useTabInfo()
  return (
    <Link
      href={`/feed/group/${feed.id}?title=${encodeURIComponent(feed.title ?? '')}&view=${view}&backTitle=${encodeURIComponent(title)}`}
      asChild
    >
      <Pressable>
        <Row gap={10} h={45} align="center">
          {feed.image ? (
            <Image
              source={{ uri: feed.image }}
              style={{ width: 24, height: 24, borderRadius: 1000 }}
            />
          ) : (
            <SiteIcon source={feed.siteUrl} />
          )}
          <Text style={{ flex: 1 }}>{feed.title}</Text>
          {feed.unread > 0 && (
            <Text>{feed.unread}</Text>
          )}
        </Row>
        <Row h={1} bg="component" w="100%" />
      </Pressable>
    </Link>
  )
}

function groupBy<T>(array: T[], key: (item: T) => string) {
  return array.reduce((acc, item) => {
    const group = key(item)
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(item)
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

function getFeedCategory(feed: Feed) {
  return feed.category || (feed.siteUrl ? (new URL(feed.siteUrl)).host : '')
}

function isSingleCategory(feeds: Feed[]) {
  return feeds.length <= 1 && !feeds.every(i => i.category)
}

export function FeedList({ view }: { view: TabViewIndex }) {
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
        : [title, data],
    ).flat(),
    [feedsGrouped],
  )

  const expandedSections = useAtomValue(expandedSectionsAtom)

  return (
    <Animated.FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={{ width: '100%', paddingHorizontal: 18 }}
      data={data}
      extraData={expandedSections}
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return item === ''
            ? null
            : (
                <FeedFolder
                  category={item}
                  feedIdList={feedsGrouped[item].map(i => i.id)}
                  unread={feedsGrouped[item].reduce((acc, sub) => acc + sub.unread, 0)}
                />
              )
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
