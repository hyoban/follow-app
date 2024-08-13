import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ActivityIndicator, Platform, ScrollView, TextInput } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import useSWRMutation from 'swr/mutation'

import { apiClient } from '~/api/client'
import { Column, Container, Iconify, Row, Text } from '~/components'
import { SiteImage } from '~/components/site-image'

type InferResponseType<T> = T extends (args: any, options: any | undefined) => Promise<infer R> ? NonNullable<R> : never
type DiscoverList = InferResponseType<typeof apiClient.discover.$post>['data']

function DiscoverItem({ item }: { item: DiscoverList[number] }) {
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
        <Iconify icon="mingcute:right-line" size={18} />
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
      <ScrollView>
        <Container p={10} gap={10}>
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
            : (
                <>
                  <Text>{`Found ${data?.data.length ?? 0} feeds`}</Text>
                  {data && data.data.length > 0 && data.data.map(item => <DiscoverItem key={item.feed.id} item={item} />)}
                </>
              )}
        </Container>
      </ScrollView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  )
}
