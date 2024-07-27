import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { Image } from 'expo-image'
import { Stack } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  Easing,
  Keyframe,
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useStyles } from 'react-native-unistyles'

import { Container, Iconify, Row, Text } from '~/components'
import { db } from '~/db'
import type { Feed } from '~/db/schema'
import { feeds } from '~/db/schema'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function FeedFolder({
  category,
  unread,
  isExpanded,
  setIsExpanded,
}: {
  category: string
  unread: number
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}) {
  const rotate = useSharedValue(isExpanded ? '90deg' : '0deg')
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: rotate.value }] }))

  return (
    <>
      <Row gap={10} h={40}>
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
        <Text>{unread}</Text>
      </Row>
      <Row h={1} bg="component" w="100%" />
    </>
  )
}

function FeedItem({
  feed,
}: {
  feed: Feed
}) {
  const { theme } = useStyles()
  return (
    <>
      <Row gap={10} h={40}>
        {feed.image ? (
          <Image
            source={{ uri: feed.image }}
            style={{ width: 24, height: 24, borderRadius: 1000 }}
          />
        ) : (
          <Iconify icon="mdi:rss" color={theme.colors.gray10} />
        )}
        <Text style={{ flex: 1 }}>{feed.title}</Text>
        <Text>{feed.unread}</Text>
      </Row>
      <Row h={1} bg="component" w="100%" />
    </>
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

export default function Home() {
  const { data } = useLiveQuery(db.query.feeds.findMany({ where: eq(feeds.view, 0) }))
  const feedsGrouped = useMemo(() => groupBy(data, 'category'), [data])
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
    <>
      <Stack.Screen />
      <Container p={10} gap={10}>
        <Animated.FlatList
          style={{ width: '100%' }}
          data={listData}
          extraData={expandedSections}
          renderItem={({ item }) => {
            if (typeof item === 'string') {
              return item === 'No Category Found'
                ? null
                : (
                    <FeedFolder
                      category={item}
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
                  {item.map((subscription: any) => (
                    <FeedItem key={subscription.feedId} feed={subscription} />
                  ))}
                </Animated.View>
              </LayoutAnimationConfig>
            )
          }}
        />
      </Container>
    </>
  )
}
