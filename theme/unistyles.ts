import { UnistylesRegistry } from 'react-native-unistyles'

import { darkTheme, lightTheme } from '.'
import { breakpoints } from './breakpoints'

type AppBreakpoints = typeof breakpoints
type AppThemes = {
  light: typeof lightTheme
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry
  .addBreakpoints(breakpoints)
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    adaptiveThemes: true,
  })
