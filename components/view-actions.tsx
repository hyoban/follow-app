import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'

import { flagEntryReadStatus } from '~/api/entry'
import { Divider, IconButton, Iconify, Row } from '~/components'
import type { TabViewIndex } from '~/store/layout'
import { viewLayoutMapAtom } from '~/store/layout'

import { SettingsLink } from './settings-link'
import { UnreadFilter } from './unread-filter'

export function ViewActions({ view }: { view?: TabViewIndex }) {
  const router = useRouter()
  const [viewLayoutMap, setViewLayoutMap] = useAtom(viewLayoutMapAtom)

  if (view === undefined) {
    return null
  }

  return (
    <>
      <Row gap={18}>
        <IconButton
          onPress={() => {
            setViewLayoutMap((viewLayoutMap) => {
              const oldViewLayoutMap = viewLayoutMap
              return {
                ...oldViewLayoutMap,
                [view]: viewLayoutMap[view] === 'detail' ? 'list' : 'detail',
              }
            })
          }}
        >
          {
            viewLayoutMap[view] === 'detail'
              ? <Iconify icon="mingcute:align-left-line" />
              : <Iconify icon="mingcute:align-left-2-line" />
          }
        </IconButton>
        <UnreadFilter />
        <IconButton
          onPress={() => {
            flagEntryReadStatus({ view })
              .catch(console.error)
          }}
        >
          <Iconify icon="mgc:check-circle-cute-re" />
        </IconButton>
      </Row>
      <Divider type="vertical" mx={14} />
      <Row gap={18}>
        <IconButton
          onPress={() => {
            router.push(`/discover?view=${view}`)
          }}
        >
          <Iconify icon="mgc:add-cute-re" />
        </IconButton>
        <SettingsLink />
      </Row>
    </>
  )
}
