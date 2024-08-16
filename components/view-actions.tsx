import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'

import { flagEntryReadStatus } from '~/api/entry'
import type { TabViewIndex } from '~/atom/layout'
import { viewLayoutMapAtom } from '~/atom/layout'
import { Iconify } from '~/components'

export function ViewActions({ view }: { view: TabViewIndex }) {
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)
  const router = useRouter()
  return (
    <MenuView
      actions={[
        {
          id: 'mark-as-read',
          title: 'Mark as Read',
          image: 'circlebadge.fill',
        },
        {
          id: 'switch-layout',
          title: `Switch layout to ${viewLayoutMap[view] === 'detail' ? 'List' : 'Detail'}`,
          image: 'list.bullet',
        },
        {
          id: 'add-feed',
          title: 'Add Feed',
          image: 'plus',
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        switch (nativeEvent.event) {
          case 'mark-as-read': {
            flagEntryReadStatus({ view })
              .catch(console.error)
            break
          }
          case 'switch-layout': {
            setViewLayoutMap((viewLayoutMap) => {
              const oldViewLayoutMap = viewLayoutMap
              return {
                ...oldViewLayoutMap,
                [view]: viewLayoutMap[view] === 'detail' ? 'list' : 'detail',
              }
            })
            break
          }
          case 'add-feed': {
            router.push(`/discover?view=${view}`)
            break
          }
          default: {
            break
          }
        }
      }}
    >
      <Iconify
        icon="mingcute:more-2-fill"
      />
    </MenuView>
  )
}
