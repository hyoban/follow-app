import { useAtomValue } from 'jotai'
import { useMemo, useRef } from 'react'
import { useStyles } from 'react-native-unistyles'

import { Column, Container, Divider } from '~/components'
import { EntryList } from '~/components/entry-list'
import { FeedList } from '~/components/feed-list'
import { tabViewList } from '~/consts/view'
import { useFeedList } from '~/hooks/use-feed-list'
import { useFeedIdListMapStore } from '~/store/feed'
import { viewLayoutMapAtom } from '~/store/layout'
import { createViewStore, ViewContext } from '~/store/view'
import { isTablet } from '~/theme/breakpoints'

const viewIndex = 1
const viewTitle = tabViewList.find(i => i.view === viewIndex)?.title as string

function EntryListContainer() {
  const { data } = useFeedList(viewIndex)
  const feedIdList = useMemo(() => data?.map(i => i.id) ?? [], [data])
  const selectedFeedIdList = useFeedIdListMapStore(state => state.feedIdListMap[viewIndex])
  return (
    <EntryList
      feedIdList={selectedFeedIdList.length > 0 ? selectedFeedIdList : feedIdList}
      view={viewIndex}
    />
  )
}

function TabletView() {
  return (
    <>
      <Container direction="row">
        <Column flex={1}>
          <FeedList view={viewIndex} />
        </Column>
        <Divider type="vertical" />
        <Column flex={2}>
          <EntryListContainer />
        </Column>
      </Container>
    </>
  )
}

function MobileView() {
  const viewLayoutMap = useAtomValue(viewLayoutMapAtom)
  return (
    <>
      <Container>
        {viewLayoutMap[viewIndex] === 'list' && <FeedList view={viewIndex} />}
        {viewLayoutMap[viewIndex] === 'detail' && <EntryListContainer />}
      </Container>
    </>
  )
}

export default function TabPage() {
  const store = useRef(createViewStore({ view: viewIndex, title: viewTitle })).current
  const { breakpoint } = useStyles()
  return (
    <ViewContext.Provider value={store}>
      {
        isTablet(breakpoint)
          ? <TabletView />
          : <MobileView />
      }
    </ViewContext.Provider>
  )
}
