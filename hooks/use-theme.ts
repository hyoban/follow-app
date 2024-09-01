import type { Theme as NavigationTheme } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import { Appearance, Platform, useColorScheme } from 'react-native'
import { UnistylesRuntime, useInitialTheme, useStyles } from 'react-native-unistyles'

import { accentColorAtom, userThemeAtom } from '~/store/theme'
import { getAccentColor } from '~/theme'

export function useTheme() {
  const userTheme = useAtomValue(userThemeAtom)
  const systemTheme = useColorScheme()

  // initialize theme and sync with user preference
  useInitialTheme(userTheme === 'system' ? systemTheme === 'dark' ? 'dark' : 'light' : userTheme)
  useEffect(() => {
    if (userTheme === 'system') {
      Appearance.setColorScheme(null)
      UnistylesRuntime.setTheme(systemTheme === 'dark' ? 'dark' : 'light')
      return
    }
    Appearance.setColorScheme(userTheme)
    UnistylesRuntime.setTheme(userTheme)
  }, [systemTheme, userTheme])

  const selectedAccentColor = useAtomValue(accentColorAtom)

  // update theme with accent color
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

  const { theme } = useStyles()
  const navigationTheme = useMemo<NavigationTheme>(() => (
    {
      dark: systemTheme === 'dark',
      colors: {
        background: theme.colors.gray1,
        border: theme.colors.gray6,
        card: theme.colors.gray2,
        notification: theme.colors.accent9,
        primary: theme.colors.accent9,
        text: theme.colors.gray12,
      },
    }
  ), [
    systemTheme,
    theme.colors.accent9,
    theme.colors.gray1,
    theme.colors.gray12,
    theme.colors.gray2,
    theme.colors.gray6,
  ])

  // handle Android navigation bar
  useEffect(() => {
    if (Platform.OS === 'android') {
      void NavigationBar.setPositionAsync('absolute')
      void NavigationBar.setBackgroundColorAsync(theme.colors.gray2)
      void NavigationBar.setButtonStyleAsync(UnistylesRuntime.colorScheme === 'light' ? 'dark' : 'light')
    }
  }, [theme.colors.gray2])

  return useMemo(() => ({ navigationTheme }), [navigationTheme])
}
