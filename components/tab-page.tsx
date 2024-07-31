import { useAtomValue } from 'jotai'

import { viewLayoutMapAtom } from '~/atom/layout'
import { Container } from '~/components'
import { EntryList } from '~/components/entry-list'
import { FeedList } from '~/components/feed-list'
import { useFeedList } from '~/hooks/use-feed-list'
import { useTab } from '~/hooks/use-tab-title'

export function TabPage() {
  const { view } = useTab()
  const viewLayoutMap = useAtomValue(viewLayoutMapAtom)
  const { data } = useFeedList(view)
  return (
    <>
      <Container>
        {viewLayoutMap[view] === 'list' && <FeedList view={view} />}
        {viewLayoutMap[view] === 'detail' && <EntryList feedIdList={data?.map(i => i.id) ?? []} />}
      </Container>
    </>
  )
}
