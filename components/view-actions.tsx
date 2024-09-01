import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { useStyles } from 'react-native-unistyles'

import { flagEntryReadStatus } from '~/api/entry'
import { IconButton, Iconify } from '~/components'
import type { TabViewIndex } from '~/store/layout'
import { viewLayoutMapAtom } from '~/store/layout'
import { isTablet } from '~/theme/breakpoints'

import Menu from './menu'

function ViewActionsMobile({ view }: { view: TabViewIndex }) {
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)
  const router = useRouter()
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
    </Menu>
  )
}

function ViewActionsTablet({ view }: { view: TabViewIndex }) {
  const router = useRouter()
  return (
    <>
      <IconButton
        onPress={() => {
          flagEntryReadStatus({ view })
            .catch(console.error)
        }}
      >
        <Iconify icon="mgc:check-circle-cute-re" />
      </IconButton>
      <IconButton
        onPress={() => {
          router.push(`/discover?view=${view}`)
        }}
      >
        <Iconify icon="mgc:add-cute-re" />
      </IconButton>
    </>
  )
}

export function ViewActions({ view }: { view: TabViewIndex }) {
  const { breakpoint } = useStyles()
  return isTablet(breakpoint)
    ? <ViewActionsTablet view={view} />
    : <ViewActionsMobile view={view} />
}
