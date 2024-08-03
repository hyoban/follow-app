import { useSetAtom } from 'jotai'
import { Pressable } from 'react-native'

import { toggleUnreadOnlyAtom } from '~/atom/entry-list'
import { useShowUnreadOnly } from '~/hooks/use-entry-list'

import { Iconify } from './icon'

export function UnreadFilter(
  { feedIdList }: { feedIdList: string[] },
) {
  const showUnreadOnly = useShowUnreadOnly(feedIdList)
  const toggleUnreadOnly = useSetAtom(toggleUnreadOnlyAtom)

  if (feedIdList.length === 0) {
    return null
  }

  return (
    <Pressable
      onPress={() => {
        toggleUnreadOnly(feedIdList)
      }}
    >
      {showUnreadOnly
        ? <Iconify icon="mingcute:document-fill" />
        : <Iconify icon="mingcute:document-line" />}
    </Pressable>
  )
}
