import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { useStyles } from 'react-native-unistyles'

import { flagEntryReadStatus } from '~/api/entry'
import { Iconify } from '~/components'
import type { TabViewIndex } from '~/store/layout'
import { viewLayoutMapAtom } from '~/store/layout'

import Menu from './menu'

export function ViewActions({ view }: { view: TabViewIndex }) {
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)
  const router = useRouter()
  const { breakpoint } = useStyles()
  return (
    <Menu
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
      ].filter(({ id }) => {
        if (id === 'switch-layout') {
          return breakpoint !== 'tablet'
        }
        return true
      })}
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
    </Menu>
  )
}
