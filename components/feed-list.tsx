import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
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

import { isSyncingFeedsAtom, syncFeeds, syncFeedsEffect } from '~/api/feed'
import { Iconify, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { db } from '~/db'
import type { Feed } from '~/db/schema'
import { useQuerySubscription } from '~/hooks/use-query-subscription'

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

  return (
    <Link
      href={`/feed/group/${feedIdList.join('/')}`}
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
  return (
    <Link
      href={`/feed/group/${feed.id}`}
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

const storage = createJSONStorage<string[]>(() => AsyncStorage)
const expandedSectionsAtom = atomWithStorage<string[]>('expanded-sections', [], storage)
const toggleExpandedSectionAtom = atom(null, async (get, set, update: string) => {
  const expandedSections = await get(expandedSectionsAtom)
  if (expandedSections.includes(update)) {
    set(expandedSectionsAtom, expandedSections.filter(i => i !== update))
      .catch(console.error)
  }
  else {
    set(expandedSectionsAtom, [...expandedSections, update])
      .catch(console.error)
  }
})

function getFeedCategory(feed: Feed) {
  return feed.category || (feed.siteUrl ? (new URL(feed.siteUrl)).host : '')
}

function isSingleCategory(feeds: Feed[]) {
  return feeds.length <= 1 && !feeds.every(i => i.category)
}

export function FeedList({ view }: { view: number }) {
  const refreshing = useAtomValue(isSyncingFeedsAtom)
  useAtomValue(syncFeedsEffect)

  const { data: feeds } = useQuerySubscription(
    db.query.feeds.findMany({
      where(schema, { eq }) {
        return eq(schema.view, view)
      },
    }),
    ['feeds', { view }],
  )
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
      refreshing={refreshing}
      onRefresh={syncFeeds}
    />
  )
}