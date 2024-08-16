import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { Redirect, Stack } from 'expo-router'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import BackgroundFetch from 'react-native-background-fetch'
import TrackPlayer, { Capability, Event } from 'react-native-track-player'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { syncFeeds } from '~/api/feed'
import { Row } from '~/components'
import { LoadingIndicator } from '~/components/loading-indicator'
import { SettingsLink } from '~/components/settings-link'
import { UnreadFilter } from '~/components/unread-filter'
import { ViewActions } from '~/components/view-actions'
import { tabViewList } from '~/consts/view'
import { db } from '~/db'
import { useCurrentUser } from '~/hooks/use-current-user'

TrackPlayer.registerPlaybackService(() => async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play())
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause())
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop())
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext())
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious())
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position))
})

TrackPlayer.setupPlayer()
  .then(() => {
    TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
      ],

      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [Capability.Play, Capability.Pause],
    })
      .catch(console.error)
  })
  .catch(console.error)

export default function RootLayout() {
  useEffect(() => {
    const checkStatusAsync = async () => {
      // BackgroundFetch event handler.
      const onEvent = async (taskId: string) => {
        console.info('[BackgroundFetch] task:', taskId)
        // Do your background work...
        await syncFeeds()
        const unreadCount = (await db.query.feeds.findMany()).reduce((acc, feed) => acc + feed.unread, 0) ?? 0
        Notifications.requestPermissionsAsync()
          .then(() => Notifications.setBadgeCountAsync(unreadCount))
          .catch(console.error)

        // IMPORTANT:  You must signal to the OS that your task is complete.
        BackgroundFetch.finish(taskId)
      }

      // Timeout callback is executed when your Task has exceeded its allowed running-time.
      // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
      const onTimeout = async (taskId: string) => {
        console.warn('[BackgroundFetch] TIMEOUT task:', taskId)
        BackgroundFetch.finish(taskId)
      }

      // Initialize BackgroundFetch only once when component mounts.
      const status = await BackgroundFetch.configure({ minimumFetchInterval: 15 }, onEvent, onTimeout)

      console.info('[BackgroundFetch] configure status:', status)
    }

    checkStatusAsync()
      .catch(console.error)
  }, [])

  const { styles } = useStyles(styleSheet)

  const { user } = useCurrentUser()

  if (!user)
    return <Redirect href="/auth" />

  return (
    <Stack screenOptions={{ animation: 'ios' }}>
      <Stack.Screen
        name="(tabs)"
        options={({ route }) => {
          const view = tabViewList.find(view => view.name === getFocusedRouteNameFromRoute(route))!
          return {
            title: view.title,
            headerLeft: () => (
              <Row gap={18}>
                <SettingsLink />
              </Row>
            ),
            headerRight: () => (
              <Row gap={18}>
                <LoadingIndicator />
                <UnreadFilter />
                <ViewActions view={view.view} />
              </Row>
            ),
            headerTitleAlign: 'center',
            headerTitleStyle: styles.title,
            headerLargeTitleStyle: styles.title,
            headerBlurEffect: 'regular',
            headerTransparent: Platform.select({
              ios: true,
              android: false,
            }),
          }
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          title: 'Settings',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
        }}
      />
      <Stack.Screen
        name="discover"
        options={{
          presentation: 'modal',
          title: 'Discover',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
        }}
      />
    </Stack>
  )
}

const styleSheet = createStyleSheet(theme => ({
  header: {
    backgroundColor: theme.colors.gray2,
  },
  title: {
    color: theme.colors.gray12,
    fontFamily: 'SN Pro',
    fontWeight: 'bold',
  },
}))
