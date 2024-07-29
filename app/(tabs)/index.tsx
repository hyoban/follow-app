import { eq } from 'drizzle-orm'
import { Image } from 'expo-image'
import { Link, Stack } from 'expo-router'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  Easing,
  Keyframe,
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { createOrUpdateFeedsInDB } from '~/api/feed'
import { layoutAtom } from '~/atom/layout'
import { Container, Iconify, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { db } from '~/db'
import type { Feed } from '~/db/schema'
import { feeds } from '~/db/schema'
import { useQuerySubscription } from '~/hooks/use-query-subscription'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function FeedFolder({
  category,
  feedIdList,
  unread,
  isExpanded,
  setIsExpanded,
}: {
  category: string
  feedIdList: string[]
  unread: number
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}) {
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
              setIsExpanded(!isExpanded)
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

function groupBy<T>(array: T[], key: string) {
  return array.reduce((acc, item) => {
    const group = (item as any)[key] ?? 'No Category Found'
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

function FeedLayout() {
  const [isFetching, setIsFetching] = useState(false)
  const updateFeeds = useCallback(() => {
    setIsFetching(true)
    createOrUpdateFeedsInDB()
      .then(() => setIsFetching(false))
      .catch(() => setIsFetching(false))
  }, [])

  const { data } = useQuerySubscription(
    db.query.feeds.findMany({ where: eq(feeds.view, 0) }),
    ['feeds', { view: 0 }],
  )
  const feedsGrouped = useMemo(() => groupBy(data ?? [], 'category'), [data])
  const listData = useMemo(
    () => Array.from(
      Object.entries(feedsGrouped),
      ([title, data]) => [title, data],
    ).flat(),
    [feedsGrouped],
  )

  const [expandedSections, setExpandedSections] = useState(new Set<string>())
  const handleToggle = (title: string) => {
    setExpandedSections((expandedSections) => {
      const next = new Set(expandedSections)
      if (next.has(title)) {
        next.delete(title)
      }
      else {
        next.add(title)
      }
      return next
    })
  }
  return (
    <Animated.FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={{ width: '100%', paddingHorizontal: 18 }}
      data={listData}
      extraData={expandedSections}
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return item === 'No Category Found'
            ? null
            : (
                <FeedFolder
                  category={item}
                  feedIdList={feedsGrouped[item].map(i => i.id)}
                  unread={feedsGrouped[item].reduce((acc, sub) => acc + sub.unread, 0)}
                  isExpanded={expandedSections.has(item)}
                  setIsExpanded={() => handleToggle(item)}
                />
              )
        }
        const shouldShow = !item[0].category || expandedSections.has(item[0].category)
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
      refreshing={isFetching}
      onRefresh={updateFeeds}
    />
  )
}

export default function Home() {
  const layout = useAtomValue(layoutAtom)

  return (
    <>
      <Stack.Screen />
      <Container>
        {layout === 'feed' && <FeedLayout />}
      </Container>
    </>
  )
}
