import '../theme/unistyles'

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import * as Notifications from 'expo-notifications'
import { Slot } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import BackgroundFetch from 'react-native-background-fetch'
import TrackPlayer, { Capability, Event } from 'react-native-track-player'

import { syncFeeds } from '~/api/feed'
import { Text } from '~/components'
import { db, expoDb } from '~/db'
import migrations from '~/drizzle/migrations'

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(app)',
}

TrackPlayer.registerPlaybackService(() => async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play())
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause())
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop())
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext())
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious())
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position))
})

function DrizzleStudio() {
  useDrizzleStudio(expoDb)
  return null
}

export default function Root() {
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

  const { success, error } = useMigrations(db, migrations)

  useEffect(() => {
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
  }, [])

  if (error) {
    return (
      <View>
        <Text>
          Migration error:
          {error.message}
        </Text>
      </View>
    )
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    )
  }
  return (
    <>
      {__DEV__ && <DrizzleStudio />}
      <Slot />
    </>
  )
}
