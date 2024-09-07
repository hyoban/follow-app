import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { formatDate } from 'date-fns'
import { Video } from 'expo-av'
import * as Clipboard from 'expo-clipboard'
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import * as Sharing from 'expo-sharing'
import type { InferResponseType } from 'hono/client'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import ContextMenu from 'react-native-context-menu-view'
import PagerView from 'react-native-pager-view'
import Animated, { FadeIn, runOnJS, SlideInDown, SlideOutDown, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { toast } from 'react-native-reanimated-toasts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles'
import useSWR from 'swr'

import { apiClient } from '~/api/client'
import { flagEntryCollectionStatus, flagEntryReadStatus, loadEntryContent } from '~/api/entry'
import { Column, Container, Divider, IconButton, Iconify, Row, Text } from '~/components'
import HtmlRender from '~/components/dom/html-render'
import { IconStarCuteFi, IconStarCuteRe } from '~/components/icons'
import { Image } from '~/components/image'
import { TipPowerBottomSheet } from '~/components/tip-power-bottom-sheet'
import { READ_USER_AVATAR_COUNT } from '~/consts/limit'
import type { Entry, Feed } from '~/db/schema'
import { useEntryList } from '~/hooks/use-entry-list'
import { openExternalUrl, readability } from '~/lib/utils'
import { enableReadabilityMapAtom, showFooterAtom, toggleEnableReadabilityMapAtom } from '~/store/entry'
import { isNotTabletLandscape, isTabletLandscape } from '~/theme/breakpoints'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type EntryReadHistories = InferResponseType<typeof apiClient.entries.$get>['data']
type ValueOf<T> = T[keyof T]
type UserInReadHistories = ValueOf<Exclude<EntryReadHistories, undefined>['users']>

interface EntryFooterNavBarProps {
  entry?: Entry & { feed: Feed }
  readHistories?: EntryReadHistories
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.gray1,
    borderTopColor: theme.colors.gray4,
    borderTopWidth: 1,
    // fix animation
    zIndex: 9999,
  },
  userAvatar: ({ index }: { index: number }) => ({
    width: 28,
    height: 28,
    borderRadius: 14,
    borderColor: theme.colors.gray10,
    borderWidth: runtime.hairlineWidth,
    backgroundColor: theme.colors.gray2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transform: [{ translateX: -10 * index }],
  }),
}))

function EntryReadUsers({ users }: { users?: UserInReadHistories[] }) {
  const { styles } = useStyles(stylesheet)
  const readUserAvatars = users?.map(i => i?.image).filter(i => i !== null) ?? []

  return (
    <AnimatedPressable
      entering={FadeIn}
      onPress={() => {
        // TODO: open bottom sheet or modal of users which can navigate user profile route
      }}
    >
      {readUserAvatars.length > 0 && (
        <Animated.View style={{ flexDirection: 'row' }} entering={FadeIn}>
          {readUserAvatars
            .slice(0, READ_USER_AVATAR_COUNT)
            .map((image, index) => (
              <View key={image} style={styles.userAvatar({ index })}>
                <Image
                  style={{ height: '100%', width: '100%' }}
                  source={image}
                />
              </View>
            ))}
          {readUserAvatars.length > 6 && (
            <View style={styles.userAvatar({ index: READ_USER_AVATAR_COUNT })}>
              <Text size={12}>+{readUserAvatars.length - READ_USER_AVATAR_COUNT}</Text>
            </View>
          )}
        </Animated.View>
      )}
    </AnimatedPressable>
  )
}

function EntryToolbar({ entry }: { entry: Entry & { feed: Feed } }) {
  const { theme } = useStyles(stylesheet)
  const enableReadabilityMap = useAtomValue(enableReadabilityMapAtom)
  const enableReadability = useMemo(() => enableReadabilityMap[entry.feedId], [enableReadabilityMap, entry.feedId])
  const toggleEnableReadability = useSetAtom(toggleEnableReadabilityMapAtom)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  if (!entry.url) {
    return null
  }
  return (
    <>
      <Row gap={14} align="center">
        <IconButton
          onPress={() => {
            toggleEnableReadability(entry.feedId)
          }}
        >
          {enableReadability ? (
            <Iconify icon="mgc:sparkles-2-filled" />
          ) : (
            <Iconify icon="mgc:sparkles-2-cute-re" />
          )}
        </IconButton>
      </Row>
      <Divider type="vertical" mx={8} />
      <Row gap={14} align="center">
        <IconButton
          onPress={() => {
            flagEntryCollectionStatus({
              entryId: entry.id,
              collected: !entry.collections,
            })
              .catch(console.error)
          }}
        >
          {entry.collections ? <IconStarCuteFi color={theme.colors.orange5} /> : <IconStarCuteRe />}
        </IconButton>
        <IconButton
          onPress={() => {
            bottomSheetModalRef.current?.present()
          }}
        >
          <Iconify icon="mgc:power-outline" />
          <TipPowerBottomSheet
            entry={entry}
            bottomSheetModalRef={bottomSheetModalRef}
          />
        </IconButton>
        <IconButton
          onPress={() => {
            Clipboard.setStringAsync(entry.url!)
              .then(() => {
                toast.success('Copied to clipboard')
              })
              .catch(console.error)
          }}
        >
          <Iconify icon="mgc:link-cute-re" />
        </IconButton>
        <IconButton
          onPress={() => {
            openExternalUrl(entry.url, { inApp: entry.feed.view !== 1 })
              .catch(console.error)
          }}
        >
          <Iconify icon="mgc:world-2-cute-re" />
        </IconButton>
        <IconButton
          onPress={async () => {
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(entry.url!)
                .catch(console.error)
            }
          }}
        >
          <Iconify icon="mgc:share-3-cute-re" />
        </IconButton>
      </Row>
    </>
  )
}

function EntryFooterNavBar({ readHistories, entry }: EntryFooterNavBarProps) {
  const { styles } = useStyles(stylesheet)
  const { bottom } = useSafeAreaInsets()

  const inMounted = useSharedValue(false)
  const showFooter = useAtomValue(showFooterAtom)

  useEffect(() => {
    inMounted.value = true
  }, [inMounted])

  const users = readHistories?.entryReadHistories?.userIds.map(id => readHistories?.users[id]).filter(i => i != null)

  if (!entry) {
    return null
  }

  return showFooter && (
    <Animated.View
      style={[styles.footerContainer, { paddingBottom: bottom }]}
      entering={inMounted.value ? SlideInDown.duration(800) : undefined}
      exiting={SlideOutDown.duration(800)}
      collapsable={false}
    >
      <Row
        justify="space-between"
        align="center"
        px={16}
        pt={8}
        gap={8}
        h={44}
      >
        <Row
          h="100%"
          align="center"
          justify="flex-start"
          flex={1}
        >
          <EntryReadUsers key={entry.id} users={users} />
        </Row>
        <Row
          h="100%"
          align="center"
          justify="flex-end"
          flex={1}
        >
          <EntryToolbar entry={entry} />
        </Row>
      </Row>
    </Animated.View>
  )
}

export default function Page() {
  const { entryId, feedId } = useLocalSearchParams<{ entryId: string, feedId?: string }>()
  const feedIdList = useMemo(() => feedId?.split(',') ?? [], [feedId])
  const { data: entryList } = useEntryList({ feedIdList, entryIdList: [entryId] })
  const { theme } = useStyles()
  const initialPage = entryList?.findIndex(i => i.id === entryId)
  const currentEntry = entryList?.find(i => i.id === entryId)

  const navigation = useNavigation()
  const router = useRouter()

  const setShowFooter = useSetAtom(showFooterAtom)

  const { data: readHistories } = useSWR(
    ['entry-read-histories', entryId],
    async ([_, id]) => (await (await apiClient.entries.$get({ query: { id } })).json()).data,
  )

  useEffect(
    () => navigation.addListener(
      'beforeRemove',
      () => {
        setShowFooter(true)
      },
    ),
    [navigation, setShowFooter],
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
      <Container style={{ position: 'relative' }}>
        <FlatList
          horizontal
          pagingEnabled
          data={entryList ?? []}
          initialNumToRender={1}
          initialScrollIndex={(initialPage !== -1 && initialPage !== 0) ? initialPage : undefined}
          windowSize={3}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
          getItemLayout={(_data, index) => ({ length: UnistylesRuntime.screen.width, offset: UnistylesRuntime.screen.width * index, index })}
          onViewableItemsChanged={({ viewableItems }) => {
            const index = viewableItems.at(0)?.index
            if (index != null) {
              const entry = entryList?.[index]
              if (entry) {
                router.setParams({ entryId: entry.id })
                setShowFooter(true)
                if (!entry.content) {
                  loadEntryContent(entry.id)
                    .catch(console.error)
                }
                if (!entry.read) {
                  flagEntryReadStatus({ entryId: entry.id })
                    .catch(console.error)
                }
              }
            }
          }}
          renderItem={({ item }) => (
            <View style={{ width: UnistylesRuntime.screen.width }}>
              <EntryDetail entry={item} readHistories={readHistories} />
            </View>
          )}
        />
        <EntryFooterNavBar readHistories={readHistories} entry={currentEntry} />
      </Container>
    </>
  )
}

const mediaPagerViewStyleSheet = createStyleSheet((theme, runtime) => ({
  container: {
    width: {
      xs: '100%',
      tablet: '100%',
      tabletLandscape: runtime.screen.width / 3,
    },
    maxHeight: {
      xs: runtime.screen.height / 3,
      tablet: runtime.screen.height / 3,
      tabletLandscape: undefined,
    },
    alignSelf: {
      xs: 'center',
      tablet: 'center',
      tabletLandscape: undefined,
    },
    height: {
      xs: runtime.screen.height / 3,
      tablet: runtime.screen.height / 3,
      tabletLandscape: '100%',
    },
    alignItems: {
      tabletLandscape: 'center',
    },
    justifyContent: {
      tabletLandscape: 'center',
    },
  },
}))

function MediaPagerView({ entry }: { entry: Entry & { feed: Feed } }) {
  const mediaList = entry.media ?? []
  const { styles, breakpoint } = useStyles(mediaPagerViewStyleSheet)

  if (mediaList.length === 0 || entry.feed.view === 5) {
    return null
  }

  return (
    <PagerView
      style={[
        styles.container,
        isNotTabletLandscape(breakpoint) && mediaList.map(media => media.height).filter(i => i != null).length > 0
        && { height: Math.max(...mediaList.map(media => media.height).filter(i => i != null)) },
      ]}
    >
      {mediaList.map(media => (
        media.type === 'photo'
          ? (
              <Image
                key={media.url}
                source={media.url}
                style={{
                  aspectRatio: (media.width && media.height) ? media.width / media.height : 1,
                }}
                proxy={{
                  width: 700,
                  height: 0,
                }}
                contentFit="contain"
              />
            )
          : (
              <Video
                key={media.url}
                source={{ uri: media.url }}
                style={{
                  aspectRatio: (media.width && media.height) ? media.width / media.height : 1,
                }}
                useNativeControls
              />
            )
      ))}
    </PagerView>
  )
}

function MainContentScrollView({
  entry,
  readHistories,
  children,
}: {
  entry: Entry & { feed: Feed }
  readHistories?: EntryReadHistories
  children?: React.ReactNode
}) {
  const { theme } = useStyles()
  const { data: summary } = useSWR(
    ['entry-summary', entry.id],
    async () => (await apiClient.ai.summary.$get({ query: { id: entry.id } })).json(),
    {
      dedupingInterval: 1000 * 60 * 10,
    },
  )

  const enableReadabilityMap = useAtomValue(enableReadabilityMapAtom)
  const enableReadability = useMemo(() => enableReadabilityMap[entry.feedId], [enableReadabilityMap, entry.feedId])

  const { data: readabilityData } = useSWR(
    (enableReadability && entry.url) ? ['readability', entry.url] : null,
    () => readability(entry.url!),
  )

  const [showFooter, setShowFooter] = useAtom(showFooterAtom)
  const lastOffsetY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentOffsetY = event.contentOffset.y
      const diff = currentOffsetY - lastOffsetY.value

      // Already reach top or scroll up a while
      if (diff < -5 || currentOffsetY <= 10) {
        runOnJS(setShowFooter)(true)
      }
      else {
        if (currentOffsetY > 0 && diff > 10 && showFooter) {
          runOnJS(setShowFooter)(false)
        }
      }

      lastOffsetY.value = currentOffsetY
    },
  })

  const [height, setHeight] = useState(UnistylesRuntime.screen.height)

  return (
    <Animated.ScrollView
      scrollEventThrottle={8}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      {children}
      <Column gap={8}>
        <ContextMenu
          actions={
            entry.url
              ? [
                  { title: 'Copy Link', systemIcon: 'doc.on.doc' },
                  { title: 'Open Link', systemIcon: 'safari' },
                  { title: 'Open Link in Browser', systemIcon: 'safari' },
                  { title: 'Share', systemIcon: 'square.and.arrow.up' },
                ]
              : []
          }
          onPress={(e) => {
            switch (e.nativeEvent.name) {
              case 'Copy Link': {
                Clipboard.setStringAsync(entry.url!)
                  .then(() => {
                    toast.success('Copied to clipboard')
                  })
                  .catch(console.error)

                break
              }
              case 'Open Link in Browser': case 'Open Link': {
                openExternalUrl(entry.url, { inApp: e.nativeEvent.name === 'Open Link' })
                  .catch(console.error)

                break
              }
              case 'Share': {
                Sharing.shareAsync(entry.url!)
                  .catch(console.error)

                break
              }
            }
          }}
        >
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
              openExternalUrl(entry.url, { inApp: entry.feed.view !== 1 })
                .catch(console.error)
            }}
            onLongPress={() => {}}
          >
            {entry?.title}
          </Text>
        </ContextMenu>
        {entry.author && (
          <Text style={{ paddingHorizontal: 15 }}>
            {entry.author}
          </Text>
        )}
        <Row gap={5} px={15} align="center">
          <Text>
            {formatDate(entry.publishedAt, 'yyyy-MM-dd HH:mm')}
          </Text>
          <Iconify icon="mgc:eye-2-cute-re" />
          <Text>
            {readHistories?.entryReadHistories?.readCount ?? 0}
          </Text>
        </Row>
        {summary?.data && (
          <Column
            bg={theme.colors.gray2}
            p={15}
            gap={15}
          >
            <Row align="center" gap={10}>
              <Iconify icon="mgc:magic-2-cute-re" />
              <Text>AI summary</Text>
            </Row>
            <Text>
              {summary.data}
            </Text>
          </Column>
        )}
      </Column>
      <HtmlRender
        onLayout={async (size) => {
          if (size[1] !== height) {
            setHeight(size[1])
          }
        }}
        dom={{
          scrollEnabled: false,
          style: { height, width: UnistylesRuntime.screen.width },
          injectedJavaScript: `
            // prevent links from opening in the webview
            document.addEventListener('click', function(e) {
              if (e.target.tagName === 'A') {
                e.preventDefault()
                window.ReactNativeWebView.postMessage(JSON.stringify({ external_url_open: e.target.href }))
              }
            })
          `,
          onMessage: (e) => {
            let message: any = e.nativeEvent.data
            try {
              message = JSON.parse(message)
            }
            catch {
              return
            }
            if ('object' == typeof message && message.external_url_open) {
              openExternalUrl(message.external_url_open)
                .catch(console.error)
            }
          },
        }}
        content={readabilityData?.content ?? entry?.content ?? ''}
      />
      {/* <FeedContent html={readabilityData?.content ?? entry?.content ?? ''} /> */}
    </Animated.ScrollView>
  )
}

function EntryDetail({
  entry,
  readHistories,
}: {
  entry: Entry & { feed: Feed }
  readHistories?: EntryReadHistories
}) {
  const { breakpoint } = useStyles()

  if (isTabletLandscape(breakpoint)) {
    return (
      <Row minH="100%">
        <MediaPagerView entry={entry} />
        <MainContentScrollView entry={entry} readHistories={readHistories} />
      </Row>
    )
  }

  return (
    <MainContentScrollView entry={entry} readHistories={readHistories}>
      <MediaPagerView entry={entry} />
    </MainContentScrollView>
  )
}
