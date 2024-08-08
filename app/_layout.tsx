import '../theme/unistyles'

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import * as BackgroundFetch from 'expo-background-fetch'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import * as Notifications from 'expo-notifications'
import { Slot } from 'expo-router'
import * as TaskManager from 'expo-task-manager'
import { useEffect } from 'react'
import { View } from 'react-native'
import TrackPlayer, { Capability, Event } from 'react-native-track-player'

import { syncFeeds } from '~/api/feed'
import { Text } from '~/components'
import { db, expoDb } from '~/db'
import migrations from '~/drizzle/migrations'

const BACKGROUND_FETCH_TASK = 'background-fetch'

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  await syncFeeds()
  const unreadCount = (await db.query.feeds.findMany()).reduce((acc, feed) => acc + feed.unread, 0) ?? 0
  Notifications.requestPermissionsAsync()
    .then(() => Notifications.setBadgeCountAsync(unreadCount))
    .catch(console.error)

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData
})

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  })
}

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
    checkStatusAsync()
      .catch(console.error)
  }, [])

  const checkStatusAsync = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
    if (!isRegistered) {
      await registerBackgroundFetchAsync()
    }
  }

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
