import { createStyleSheet } from 'react-native-unistyles'

export const commonStylesheet = createStyleSheet(theme => ({
  appBackground: {
    backgroundColor: theme.colors.gray1,
  },
  subtleBackground: {
    backgroundColor: theme.colors.gray2,
  },
  lowContrastText: {
    color: theme.colors.gray11,
  },
  highContrastText: {
    color: theme.colors.gray12,
  },
}))
