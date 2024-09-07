import '../theme/unistyles'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { PortalProvider } from '@gorhom/portal'
import { ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import type { AppStateStatus } from 'react-native'
import { AppState } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createModalStack, ModalProvider } from 'react-native-modalfy'
import { Toaster } from 'react-native-reanimated-toasts'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SWRConfig } from 'swr'

import { Text } from '~/components'
import { AIDailyModal } from '~/components/ai-daily'
import { db, expoDb } from '~/db'
import migrations from '~/drizzle/migrations'
import { useNavigationTheme, useTheme } from '~/hooks/use-theme'

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: '(app)',
}

function DrizzleStudio() {
  useDrizzleStudio(expoDb as any)
  return null
}

SplashScreen.preventAutoHideAsync()
  .catch(console.error)

const stack = createModalStack({
  AIDailyModal,
})

export default function Root() {
  useTheme()
  const navigationTheme = useNavigationTheme()

  const { success, error } = useMigrations(db, migrations)

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
      <PortalProvider>
        <ThemeProvider value={navigationTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <ModalProvider stack={stack}>
                <Slot />
                <Toaster />
              </ModalProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
          {__DEV__ && <DrizzleStudio />}
        </ThemeProvider>
      </PortalProvider>
    </SWRConfig>
  )
}
