import '../theme/unistyles'

import { PortalProvider } from '@gorhom/portal'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useFonts } from 'expo-font'
import * as NavigationBar from 'expo-navigation-bar'
import { Drawer } from 'expo-router/drawer'
import * as SplashScreen from 'expo-splash-screen'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import type { AppStateStatus } from 'react-native'
import { Appearance, AppState, Platform, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ToastProvider } from 'react-native-toast-notifications'
import { UnistylesRuntime, useInitialTheme, useStyles } from 'react-native-unistyles'
import { SWRConfig } from 'swr'

import { Text } from '~/components'
import { DrawerContent } from '~/components/drawer-content'
import { db, expoDb } from '~/db'
import migrations from '~/drizzle/migrations'
import { accentColorAtom, userThemeAtom } from '~/store/theme'
import { getAccentColor } from '~/theme'

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
  const userTheme = useAtomValue(userThemeAtom)
  const colorScheme = useColorScheme()
  useInitialTheme(userTheme === 'system' ? colorScheme === 'dark' ? 'dark' : 'light' : userTheme)
  useEffect(() => {
    if (userTheme === 'system') {
      Appearance.setColorScheme(null)
      UnistylesRuntime.setTheme(colorScheme === 'dark' ? 'dark' : 'light')
      return
    }
    Appearance.setColorScheme(userTheme)
    UnistylesRuntime.setTheme(userTheme)
  }, [colorScheme, userTheme])

  const selectedAccentColor = useAtomValue(accentColorAtom)
  useEffect(() => {
    const { accent, accentA, accentDark, accentDarkA } = getAccentColor(selectedAccentColor);
    (['light', 'dark'] as const).forEach((themeName) => {
      UnistylesRuntime.updateTheme(
        themeName,
        oldTheme => ({
          ...oldTheme,
          colors: {
            ...oldTheme.colors,
            ...accent,
            ...accentA,
            ...accentDark,
            ...accentDarkA,
          },
        }),
      )
    })
  }, [selectedAccentColor])

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <ToastProvider offsetTop={100} duration={1000} placement="top">
            <ThemeProvider
              value={UnistylesRuntime.colorScheme === 'light' ? DefaultTheme : DarkTheme}
            >
              {__DEV__ && <DrizzleStudio />}
              <Drawer
                screenOptions={{
                  headerShown: false,
                  swipeEnabled: false,
                }}
                drawerContent={props => <DrawerContent {...props} />}
              />
            </ThemeProvider>
          </ToastProvider>
        </PortalProvider>
      </SWRConfig>
    </GestureHandlerRootView>
  )
}
