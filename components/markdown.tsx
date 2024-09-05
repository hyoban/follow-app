import type { MarkdownProps } from 'react-native-markdown-display'
import MarkdownDisplay from 'react-native-markdown-display'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

export function Markdown({ children, style, ...rest }: MarkdownProps & { children?: string }) {
  const { styles } = useStyles(styleSheet)
  return (
    <MarkdownDisplay
      children={children ?? ''}
      style={{ ...styles, ...style }}
      {...rest}
    />
  )
}

const styleSheet = createStyleSheet(theme => ({
  text: {
    color: theme.colors.gray12,
  },
  bullet_list_icon: {
    color: theme.colors.gray12,
  },
  ordered_list_icon: {
    color: theme.colors.gray12,
  },
}))
