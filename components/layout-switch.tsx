import { useAtom } from 'jotai'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { viewLayoutMapAtom } from '~/atom/layout'
import { useTabInfo } from '~/hooks/use-tab-info'

import { Iconify } from './icon'

export function LayoutSwitch() {
  const { styles } = useStyles(styleSheet)
  const { view } = useTabInfo()
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)
  return (
    viewLayoutMap[view] === 'detail'
      ? (
          <Iconify
            icon="mingcute:directory-fill"
            style={styles.icon}
            onPress={() => setViewLayoutMap((viewLayoutMap) => {
              const oldViewLayoutMap = viewLayoutMap
              return { ...oldViewLayoutMap, [view]: 'list' }
            })}
          />
        )
      : (
          <Iconify
            icon="mingcute:list-check-fill"
            style={styles.icon}
            onPress={() => setViewLayoutMap((viewLayoutMap) => {
              const oldViewLayoutMap = viewLayoutMap
              return { ...oldViewLayoutMap, [view]: 'detail' }
            })}
          />
        )
  )
}

const styleSheet = createStyleSheet(theme => ({
  icon: {
    backgroundColor: theme.colors.gray2,
  },
}))
