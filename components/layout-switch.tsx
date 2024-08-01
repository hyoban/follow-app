import { useAtom } from 'jotai'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { viewLayoutMapAtom } from '~/atom/layout'
import { useTab } from '~/hooks/use-tab-title'

import { Row } from './flex'
import { Iconify } from './icon'

export function LayoutSwitch() {
  const { styles } = useStyles(styleSheet)
  const { view } = useTab()
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)
  return (
    <Row mr={18}>
      {viewLayoutMap[view] === 'detail' ? (
        <Iconify
          icon="mingcute:folder-2-fill"
          style={styles.icon}
          onPress={() => setViewLayoutMap(async (viewLayoutMap) => {
            const oldViewLayoutMap = await viewLayoutMap
            return { ...oldViewLayoutMap, [view]: 'list' }
          })}
        />
      ) : (
        <Iconify
          icon="mingcute:list-check-fill"
          style={styles.icon}
          onPress={() => setViewLayoutMap(async (viewLayoutMap) => {
            const oldViewLayoutMap = await viewLayoutMap
            return { ...oldViewLayoutMap, [view]: 'detail' }
          })}
        />
      )}
    </Row>
  )
}

const styleSheet = createStyleSheet(theme => ({
  icon: {
    backgroundColor: theme.colors.gray2,
  },
}))
