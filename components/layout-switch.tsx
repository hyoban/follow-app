import { usePathname } from 'expo-router'
import { useAtom } from 'jotai'

import { viewLayoutMapAtom } from '~/atom/layout'
import { tabViewList } from '~/consts/view'

import { Iconify } from './icon'

export function LayoutSwitch() {
  const path = usePathname()
  const view = tabViewList.find(tabView => tabView.path === path)?.view
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)

  if (view === undefined) {
    return null
  }

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
