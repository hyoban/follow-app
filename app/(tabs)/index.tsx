import { Image } from 'expo-image'
import { Stack } from 'expo-router'
import { useState } from 'react'
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
import useSwr from 'swr'

import { apiClient } from '~/api/client'
import { Container, Iconify, Row, Text } from '~/components'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function SubscriptionFolder({
  category,
  feedIds,
  isExpanded,
  setIsExpanded,
}: {
  category: string
  feedIds: string[]
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}) {
  const { data } = useSwr(
    `reads`,
    () => apiClient.reads.$get({ query: { view: '0' } }),
  )
  const reeds = feedIds.map(feedId => data?.data[feedId] ?? 0)
    .reduce((acc, item) => acc + item, 0)

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
        <Text>{reeds}</Text>
      </Row>
      <Row h={1} bg="component" w="100%" />
    </>
  )
}

function SubscriptionItems({
  subscription,
}: {
  subscription: any
}) {
  const { data } = useSwr(
    `reads`,
    () => apiClient.reads.$get({ query: { view: '0' } }),
  )
  const { theme } = useStyles()
  const read = data?.data[subscription.feedId]

  return (
    <>
      <Row gap={10} h={40}>
        {subscription.feeds.image ? (
          <Image
            source={{ uri: subscription.feeds.image }}
            style={{ width: 24, height: 24, borderRadius: 1000 }}
          />
        ) : (
          <Iconify icon="mdi:rss" color={theme.colors.gray10} />
        )}
        <Text style={{ flex: 1 }}>{subscription.feeds.title}</Text>
        <Text>{read}</Text>
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

export default function Home() {
  const { data } = useSwr('subscription', () => apiClient.subscriptions.$get({ query: { view: '0' } }))
  const subscriptions = groupBy(data?.data ?? [], 'category')
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
          data={Array.from(
            Object.entries(subscriptions),
            ([title, data]) => [title, data],
          ).flat()}
          extraData={expandedSections}
          renderItem={({ item }) => {
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

            if (typeof item === 'string') {
              return item === 'No Category Found'
                ? null
                : (
                    <SubscriptionFolder
                      category={item}
                      feedIds={subscriptions[item].map(subscription => subscription.feedId)}
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
                    <SubscriptionItems key={subscription.feedId} subscription={subscription} />
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
