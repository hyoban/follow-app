import { useRouter } from 'expo-router'

import type { FlagEntryReadStatusProps } from '~/api/entry'
import { flagEntryReadStatus } from '~/api/entry'

import { IconButton } from './button'
import { IconCheckCircleCuteRe } from './icons'

export function MarkAsRead(props: FlagEntryReadStatusProps & { closeAfter?: boolean }) {
  const router = useRouter()
  return (
    <IconButton
      onPress={() => {
        flagEntryReadStatus(props)
          .then(() => {
            if (props.closeAfter) {
              router.back()
            }
          })
          .catch(console.error)
      }}
    >
      <IconCheckCircleCuteRe />
    </IconButton>
  )
}
