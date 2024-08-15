import { formatDate } from 'date-fns'
import { Video } from 'expo-av'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useEffect, useMemo, useRef } from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import { UnistylesRuntime, useStyles } from 'react-native-unistyles'
import useSWR from 'swr'

import { apiClient } from '~/api/client'
import { flagEntryReadStatus, loadEntryContent } from '~/api/entry'
import { Column, Container, Iconify, Row, Text } from '~/components'
import { FeedContent } from '~/components/feed-content'
import { blurhash } from '~/consts/blur'
import type { Entry, User } from '~/db/schema'
import { useEntryList } from '~/hooks/use-entry-list'
import { useTabInfo } from '~/hooks/use-tab-info'
import { openExternalUrl } from '~/lib/utils'

export default function Page() {
  const { entryId, feedId } = useLocalSearchParams<{ entryId: string, feedId: string }>()
  const feedIdList = useMemo(() => feedId.split(','), [feedId])
  const { data: entryList } = useEntryList(feedIdList)
  const { theme } = useStyles()
  const initialPage = entryList?.findIndex(i => i.id === entryId)

  const entryIdListToMarkAsRead = useRef<string[]>([])
  const navigation = useNavigation()
  const router = useRouter()

  useEffect(
    () => navigation.addListener(
      'beforeRemove',
      () => {
        flagEntryReadStatus({ entryId: entryIdListToMarkAsRead.current })
          .catch(console.error)
      },
    ),
    [navigation],
  )

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: theme.colors.gray2,
          },
          headerTitleStyle: {
            color: theme.colors.gray12,
          },
        }}
      />
      <Container>
        <FlatList
          horizontal
          pagingEnabled
          data={entryList ?? []}
          initialNumToRender={1}
          initialScrollIndex={initialPage ?? 0}
          windowSize={3}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}
          getItemLayout={(_data, index) => ({ length: UnistylesRuntime.screen.width, offset: UnistylesRuntime.screen.width * index, index })}
          onViewableItemsChanged={({ viewableItems }) => {
            const index = viewableItems.at(0)?.index!
            if (index !== undefined) {
              const entry = entryList?.[index]
              if (entry) {
                router.setParams({ entryId: entry.id })
                if (!entry.content) {
                  loadEntryContent(entry.id)
                    .catch(console.error)
                }
                if (!entry.read) {
                  entryIdListToMarkAsRead.current.push(entry.id)
                }
              }
            }
          }}
          renderItem={({ item }) => (
            <View style={{ width: UnistylesRuntime.screen.width }}>
              <EntryDetail entry={item} />
            </View>
          )}
        />
      </Container>
    </>
  )
}

function EntryDetail({ entry }: { entry: Entry }) {
  const { data: summary } = useSWR(
    ['entry-summary', entry.id],
    () => apiClient.ai.summary.$get({ query: { id: entry.id } }),
    {
      dedupingInterval: 1000 * 60 * 10,
    },
  )

  const { data: readHistories } = useSWR(
    ['entry-read-histories', entry.id],
    () => apiClient.entries['read-histories'][entry.id]?.$get?.().then(res => res.data as {
      users: Record<string, Omit<User, 'emailVerified'>>
      entryReadHistories: {
        entryId: string
        userIds: string[]
        readCount: number
      } | null
    }),
  )

  const users = readHistories?.entryReadHistories?.userIds.map(id => readHistories?.users[id]).filter(item => !!item)

  const readUserAvatars = users?.map(i => i?.image).filter((i): i is string => i !== null) ?? []

  const mediaList = entry.media ?? []
  const { view } = useTabInfo()

  return (
    <ScrollView>
      <Column gap={8}>
        {(mediaList.length > 0 && view !== 5) && (
          <PagerView
            style={{
              width: '100%',
              aspectRatio: Math.max(...mediaList.map(media => (media.width && media.height) ? media.width / media.height : 1), 1),
            }}
          >
            {mediaList.map(media => (
              media.type === 'photo'
                ? (
                    <Image
                      key={media.url}
                      source={{ uri: media.url }}
                      style={{
                        width: '100%',
                        aspectRatio: (media.width && media.height) ? media.width / media.height : 1,
                      }}
                      contentFit="contain"
                      placeholder={{ blurhash }}
                    />
                  )
                : (
                    <Video
                      key={media.url}
                      source={{ uri: media.url }}
                      style={{
                        width: '100%',
                        aspectRatio: (media.width && media.height) ? media.width / media.height : 1,
                      }}
                      useNativeControls
                    />
                  )
            ))}
          </PagerView>
        )}
        <Text
          size={24}
          weight={600}
          style={{
            textDecorationLine: 'underline',
            marginBottom: 8,
            paddingHorizontal: 15,
            marginVertical: 15,
          }}
          onPress={() => {
            openExternalUrl(entry.url)
              .catch(console.error)
          }}
        >
          {entry?.title}
        </Text>
        {entry.author && (
          <Text style={{ paddingHorizontal: 15 }}>
            {entry.author}
          </Text>
        )}
        <Row gap={5} px={15} align="center">
          <Text>
            {formatDate(entry.publishedAt, 'yyyy-MM-dd HH:mm')}
          </Text>
          {(readHistories?.entryReadHistories?.readCount !== undefined) && (
            <>
              <Iconify icon="mingcute:eye-2-line" />
              <Text>
                {readHistories?.entryReadHistories?.readCount}
              </Text>
            </>
          )}
        </Row>
        {readUserAvatars.length > 0 && (
          <Row mb={30} mx={15}>
            {readUserAvatars
              .slice(0, 20)
              .map((image, index) => (
                <Image
                  key={image}
                  source={{ uri: image }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    position: 'absolute',
                    left: 15 * index,
                  }}
                />
              ))}
          </Row>
        )}
        {summary?.data && (
          <Column
            bg="subtle"
            p={15}
            gap={15}
          >
            <Row align="center" gap={10}>
              <Iconify icon="mingcute:magic-2-fill" />
              <Text>AI summary</Text>
            </Row>
            <Text>
              {summary.data}
            </Text>
          </Column>
        )}
      </Column>
      <FeedContent html={entry?.content ?? ''} />
    </ScrollView>
  )
}
