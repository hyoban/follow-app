import { useAtom } from 'jotai'

import { IconButton, Iconify, Row } from '~/components'
import type { TabViewIndex } from '~/store/layout'
import { viewLayoutMapAtom } from '~/store/layout'

import { MarkAsRead } from './mark-as-read'
import { UnreadFilter } from './unread-filter'

export function ViewActions({ view }: { view?: TabViewIndex }) {
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
    </>
  )
}
