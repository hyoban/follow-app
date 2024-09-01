import { useAtom, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { cleanUnreadEntryListAtom, showUnreadOnlyAtom } from '~/store/entry'

import { IconButton } from './button'
import { IconRoundCuteFi, IconRoundCuteRe } from './icons'

export function UnreadFilter() {
  const cleanUnreadEntryList = useSetAtom(cleanUnreadEntryListAtom)
  const [showUnreadOnly, setUnreadOnly] = useAtom(showUnreadOnlyAtom)
  const toggleShowUnreadOnly = useCallback(() => {
    setUnreadOnly(i => !i)
    cleanUnreadEntryList()
  }, [cleanUnreadEntryList, setUnreadOnly])

  return (
    <IconButton onPress={toggleShowUnreadOnly}>
      {showUnreadOnly ? <IconRoundCuteFi /> : <IconRoundCuteRe />}
    </IconButton>
  )
}
