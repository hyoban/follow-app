import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { viewLayoutMapAtom } from '~/atom/layout'
import { Container } from '~/components'
import { EntryList } from '~/components/entry-list'
import { FeedList } from '~/components/feed-list'
import { useFeedList } from '~/hooks/use-feed-list'

const viewIndex = 4

export default function TabPage() {
  const viewLayoutMap = useAtomValue(viewLayoutMapAtom)
  const { data } = useFeedList(viewIndex)
  const feedIdList = useMemo(() => data?.map(i => i.id) ?? [], [data])
  return (
    <>
      <Container>
        {viewLayoutMap[viewIndex] === 'list' && <FeedList view={viewIndex} />}
        {viewLayoutMap[viewIndex] === 'detail' && <EntryList feedIdList={feedIdList} />}
      </Container>
    </>
  )
}
