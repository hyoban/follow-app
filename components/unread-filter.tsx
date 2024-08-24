import { useAtom } from 'jotai'

import { showUnreadOnlyAtom } from '~/store/entry'

import { Iconify } from './icon'

export function UnreadFilter() {
  const [showUnreadOnly, setUnreadOnly] = useAtom(showUnreadOnlyAtom)

  return showUnreadOnly
    ? (
        <Iconify
          icon="mgc:round-cute-fi"
          onPress={() => { setUnreadOnly(i => !i) }}
        />
      )
    : (
        <Iconify
          icon="mgc:round-cute-re"
          onPress={() => { setUnreadOnly(i => !i) }}
        />
      )
}
