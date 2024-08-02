import { useAtomValue } from 'jotai'

import { viewLayoutMapAtom } from '~/atom/layout'
import { Container } from '~/components'
import { EntryList } from '~/components/entry-list'
import { FeedList } from '~/components/feed-list'
import { useFeedList } from '~/hooks/use-feed-list'

const viewIndex = 5

export default function TabPage() {
  const viewLayoutMap = useAtomValue(viewLayoutMapAtom)
  const { data } = useFeedList(viewIndex)
  return (
    <>
      <Container>
        {viewLayoutMap[viewIndex] === 'list' && <FeedList view={viewIndex} />}
        {viewLayoutMap[viewIndex] === 'detail' && (
          <EntryList
            feedIdList={data?.map(i => i.id) ?? []}
            view={viewIndex}
          />
        )}
      </Container>
    </>
  )
}
