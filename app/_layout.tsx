import '../theme/unistyles'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useFonts } from 'expo-font'
import * as NavigationBar from 'expo-navigation-bar'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import type { AppStateStatus } from 'react-native'
import { AppState, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ToastProvider } from 'react-native-toast-notifications'
import { UnistylesRuntime, useStyles } from 'react-native-unistyles'
import { SWRConfig } from 'swr'

import { Text } from '~/components'
import { db, expoDb } from '~/db'
import migrations from '~/drizzle/migrations'

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(app)',
}

function DrizzleStudio() {
  useDrizzleStudio(expoDb)
  return null
}

SplashScreen.preventAutoHideAsync()
  .catch(console.error)

export default function Root() {
  const { success, error } = useMigrations(db, migrations)
  const { theme } = useStyles()

  useEffect(() => {
    if (Platform.OS === 'android') {
      void NavigationBar.setPositionAsync('absolute')
      void NavigationBar.setBackgroundColorAsync(theme.colors.gray2)
      void NavigationBar.setButtonStyleAsync(UnistylesRuntime.colorScheme === 'light' ? 'dark' : 'light')
    }
  }, [theme.colors.gray2])

  const [fontLoaded, loadFontError] = useFonts({
    'SNPro-Black': ('./font/sn-pro/SNPro-Black.otf'),
    'SNPro-BlackItalic': ('./font/sn-pro/SNPro-BlackItalic.otf'),
    'SNPro-Bold': ('./font/sn-pro/SNPro-Bold.otf'),
    'SNPro-BoldItalic': ('./font/sn-pro/SNPro-BoldItalic.otf'),
    'SNPro-Heavy': ('./font/sn-pro/SNPro-Heavy.otf'),
    'SNPro-HeavyItalic': ('./font/sn-pro/SNPro-HeavyItalic.otf'),
    'SNPro-Light': ('./font/sn-pro/SNPro-Light.otf'),
    'SNPro-LightItalic': ('./font/sn-pro/SNPro-LightItalic.otf'),
    'SNPro-Medium': ('./font/sn-pro/SNPro-Medium.otf'),
    'SNPro-MediumItalic': ('./font/sn-pro/SNPro-MediumItalic.otf'),
    'SNPro-Regular': ('./font/sn-pro/SNPro-Regular.otf'),
    'SNPro-RegularItalic': ('./font/sn-pro/SNPro-RegularItalic.otf'),
    'SNPro-Semibold': ('./font/sn-pro/SNPro-Semibold.otf'),
    'SNPro-SemiboldItalic': ('./font/sn-pro/SNPro-SemiboldItalic.otf'),
    'SNPro-Thin': ('./font/sn-pro/SNPro-Thin.otf'),
    'SNPro-ThinItalic': ('./font/sn-pro/SNPro-ThinItalic.otf'),
  })

  useEffect(() => {
    if (fontLoaded || loadFontError) {
      SplashScreen.hideAsync()
        .catch(console.error)
    }
  }, [fontLoaded, loadFontError])

  if (!fontLoaded && !loadFontError) {
    return null
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    )
  }

  if (!success) {
    return null
  }

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => true,
        initFocus(callback) {
          let appState = AppState.currentState

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            /* If it's resuming from background or inactive mode to active one */
            if (/inactive|background/.test(appState) && nextAppState === 'active') {
              callback()
            }
            appState = nextAppState
          }

          // Subscribe to the app state change events
          const subscription = AppState.addEventListener('change', onAppStateChange)

          return () => {
            subscription.remove()
          }
        },
      }}
    >
      <ToastProvider offsetTop={100} duration={1000} placement="top">
        <ThemeProvider
          value={UnistylesRuntime.colorScheme === 'light' ? DefaultTheme : DarkTheme}
        >
          {__DEV__ && <DrizzleStudio />}
          <Slot />
        </ThemeProvider>
      </ToastProvider>
    </SWRConfig>
  )
}
