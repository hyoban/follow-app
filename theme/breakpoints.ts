import type { UnistylesBreakpoints } from 'react-native-unistyles'

export const breakpoints = {
  xs: 0,
  tablet: 768,
  tabletLandscape: 1024,
} as const

export function isMobile(breakpoint: keyof UnistylesBreakpoints) {
  return breakpoint === 'xs'
}

export function isTablet(breakpoint: keyof UnistylesBreakpoints) {
  return breakpoint === 'tablet' || breakpoint === 'tabletLandscape'
}

export function isTabletLandscape(breakpoint: keyof UnistylesBreakpoints) {
  return breakpoint === 'tabletLandscape'
}

export function isNotTabletLandscape(breakpoint: keyof UnistylesBreakpoints) {
  return breakpoint !== 'tabletLandscape'
}
