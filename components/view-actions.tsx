import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'

import { Divider, IconButton, Iconify, Row } from '~/components'
import type { TabViewIndex } from '~/store/layout'
import { viewLayoutMapAtom } from '~/store/layout'

import { AIDaily } from './ai-daily'
import { MarkAsRead } from './mark-as-read'
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
      <Row gap={14}>
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
        <MarkAsRead view={view} />
      </Row>
      <Divider type="vertical" mx={12} />
      <Row gap={14}>
        <AIDaily view={view!} />
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
