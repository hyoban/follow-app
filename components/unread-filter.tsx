import { useAtom, useAtomValue } from 'jotai'

import { showUnreadOnlyAtom } from '~/atom/entry-list'
import { viewLayoutMapAtom } from '~/atom/layout'
import { useTabInfo } from '~/hooks/use-tab-info'

import { Iconify } from './icon'

export function UnreadFilter() {
  const [showUnreadOnly, setUnreadOnly] = useAtom(showUnreadOnlyAtom)
  const viewLayoutMap = useAtomValue(viewLayoutMapAtom)
  const { view } = useTabInfo()
  const hide = viewLayoutMap[view] === 'list'

  return showUnreadOnly
    ? (
        <Iconify
          icon="mingcute:document-fill"
          style={{ opacity: hide ? 0 : 1 }}
          onPress={() => { setUnreadOnly(i => !i) }}
        />
      )
    : (
        <Iconify
          icon="mingcute:document-line"
          style={{ opacity: hide ? 0 : 1 }}
          onPress={() => { setUnreadOnly(i => !i) }}
        />
      )
}
