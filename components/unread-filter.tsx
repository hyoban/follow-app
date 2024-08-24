import { useAtom } from 'jotai'

import { showUnreadOnlyAtom } from '~/store/entry-list'

import { Iconify } from './icon'

export function UnreadFilter() {
  const [showUnreadOnly, setUnreadOnly] = useAtom(showUnreadOnlyAtom)

  return showUnreadOnly
    ? (
        <Iconify
          icon="mingcute:document-fill"
          onPress={() => { setUnreadOnly(i => !i) }}
        />
      )
    : (
        <Iconify
          icon="mingcute:document-line"
          onPress={() => { setUnreadOnly(i => !i) }}
        />
      )
}
