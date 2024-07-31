import { useAtom } from 'jotai'

import { viewLayoutMapAtom } from '~/atom/layout'
import { useTab } from '~/hooks/use-tab-title'

import { Row } from './flex'
import { Iconify } from './icon'

export function LayoutSwitch() {
  const { view } = useTab()
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)
  return (
    <Row mr={18}>
      {viewLayoutMap[view] === 'detail' ? (
        <Iconify
          icon="mingcute:folder-2-fill"
          onPress={() => setViewLayoutMap(async (viewLayoutMap) => {
            const oldViewLayoutMap = await viewLayoutMap
            return { ...oldViewLayoutMap, [view]: 'list' }
          })}
        />
      ) : (
        <Iconify
          icon="mingcute:list-check-fill"
          onPress={() => setViewLayoutMap(async (viewLayoutMap) => {
            const oldViewLayoutMap = await viewLayoutMap
            return { ...oldViewLayoutMap, [view]: 'detail' }
          })}
        />
      )}
    </Row>
  )
}
