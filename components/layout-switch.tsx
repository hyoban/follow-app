import { useAtom } from 'jotai'

import { viewLayoutMapAtom } from '~/atom/layout'
import { useTabInfo } from '~/hooks/use-tab-info'

import { Iconify } from './icon'

export function LayoutSwitch() {
  const { view } = useTabInfo()
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)
  return (
    viewLayoutMap[view] === 'detail'
      ? (
          <Iconify
            icon="mingcute:directory-fill"
            onPress={() => setViewLayoutMap((viewLayoutMap) => {
              const oldViewLayoutMap = viewLayoutMap
              return { ...oldViewLayoutMap, [view]: 'list' }
            })}
          />
        )
      : (
          <Iconify
            icon="mingcute:list-check-fill"
            onPress={() => setViewLayoutMap((viewLayoutMap) => {
              const oldViewLayoutMap = viewLayoutMap
              return { ...oldViewLayoutMap, [view]: 'detail' }
            })}
          />
        )
  )
}
