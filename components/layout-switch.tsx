import { useAtom } from 'jotai'

import { layoutAtom } from '~/atom/layout'

import { Row } from './flex'
import { Iconify } from './icon'

export function LayoutSwitch() {
  const [layout, setLayout] = useAtom(layoutAtom)
  return (
    <Row mr={18}>
      {layout === 'feed' ? (
        <Iconify icon="mingcute:folder-2-fill" onPress={() => setLayout('entry')} />
      ) : (
        <Iconify icon="mingcute:list-check-fill" onPress={() => setLayout('feed')} />
      )}
    </Row>
  )
}
