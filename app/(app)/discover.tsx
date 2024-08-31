import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ActivityIndicator, Platform, ScrollView, TextInput } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import useSWRMutation from 'swr/mutation'

import { apiClient } from '~/api/client'
import { createFeed } from '~/api/feed'
import { Column, Container, Iconify, Row, Text, TextButton } from '~/components'
import { SiteImage } from '~/components/site-image'
import { useTabInfo } from '~/hooks/use-tab-info'

type InferResponseType<T> = T extends (args: any, options: any | undefined) => Promise<infer R> ? NonNullable<R> : never
type DiscoverList = InferResponseType<typeof apiClient.discover.$post>['data']

function FollowButton({ item }: { item: DiscoverList[number] }) {
  const { view } = useTabInfo()
  const [isFollowing, setIsFollowing] = useState(false)
  const router = useRouter()
  if (view === undefined || item.isSubscribed)
    return null
  return (
    <Row align="center" gap={10}>
      <TextButton
        title="Follow"
        variant="solid"
        color="accent"
        size="small"
        isLoading={isFollowing}
        onPress={() => {
          setIsFollowing(true)
          apiClient.subscriptions.$post({ json: { url: item.feed.url, view } })
            .then(() => createFeed(item.feed, { view, category: '', isPrivate: false }))
            .then(() => { router.back() })
            .catch(console.error)
            .finally(() => {
              setIsFollowing(false)
            })
        }}
      />
      <Text>{item.subscriptionCount} Followers</Text>
    </Row>
  )
}

function DiscoverItem({ item, children }: { item: DiscoverList[number], children?: React.ReactNode }) {
  const { theme } = useStyles()
  return (
    <Column
      gap={10}
      p={8}
      style={{
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.gray6,
        backgroundColor: theme.colors.gray3,
      }}
    >
      <Row gap={8} align="center">
        <SiteImage feed={item.feed} size={36} />
        <Column gap={4}>
          <Text
            weight="600"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              maxWidth: '90%',
            }}
          >
            {item.feed.title}
          </Text>
          <Text
            size={14}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              maxWidth: '90%',
            }}
          >
            {item.feed.description}
          </Text>
        </Column>
      </Row>
      <Row align="center" gap={4}>
        <Iconify icon="mgc:right-cute-fi" size={18} />
        <Text
          size={14}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            maxWidth: '90%',
          }}
        >
          {item.feed.url}
        </Text>
      </Row>
      {children}
    </Column>
  )
}

export default function DiscoverPage() {
  const { theme } = useStyles()
  const [keyword, setKeyword] = useState('')
  const { trigger, data, isMutating } = useSWRMutation(
    ['discover', keyword],
    ([_, keyword]) => apiClient.discover.$post({ json: { keyword } }),
  )

  return (
    <>
      <Container>
        <ScrollView style={{ flex: 1 }}>
          <Column p={12} gap={12}>
            <Text>Any URL or Keyword</Text>
            <TextInput
              enterKeyHint="search"
              style={{
                backgroundColor: theme.colors.gray3,
                color: theme.colors.gray12,
                borderRadius: 8,
                minHeight: 40,
                padding: 10,
              }}
              value={keyword}
              onChangeText={setKeyword}
              onSubmitEditing={() => {
                trigger()
                  .catch(console.error)
              }}
            />
            {isMutating ? <ActivityIndicator />
              : data
                ? (
                    <>
                      <Text>{`Found ${data?.data.length ?? 0} feeds`}</Text>
                      {data.data.map(item => (
                        <DiscoverItem key={item.feed.id} item={item}>
                          <FollowButton item={item} />
                        </DiscoverItem>
                      ))}
                    </>
                  )
                : null}
          </Column>
        </ScrollView>
      </Container>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  )
}
