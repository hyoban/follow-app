import { useRouter } from 'expo-router'

import type { TabViewIndex } from '~/store/layout'

import { AIDaily } from './ai-daily'
import { IconButton } from './button'
import { Row } from './flex'
import { IconAddCuteRe } from './icons'
import { SettingsLink } from './settings-link'

export function UserActions({ view }: { view?: TabViewIndex }) {
  const router = useRouter()
  return (
    <Row gap={14} align="center">
      <SettingsLink />
      <IconButton
        onPress={() => {
          router.push(`/discover?view=${view}`)
        }}
      >
        <IconAddCuteRe />
      </IconButton>
      {(view === 0 || view === 1) && <AIDaily view={view!} />}
    </Row>
  )
}
