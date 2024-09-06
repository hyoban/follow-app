import { Stack, useLocalSearchParams } from 'expo-router'
import { Platform } from 'react-native'

import { Container } from '~/components'
import { EntryList } from '~/components/entry-list'
import type { TabViewIndex } from '~/store/layout'

type PageLocalSearchParams = {
  title: string
  view: string
  backTitle: string
  collected?: string
}

export default function Page() {
  const {
    title: headerTitle,
    backTitle: headerBackTitle,
    view,
    collected,
  } = useLocalSearchParams<PageLocalSearchParams>()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle,
          headerBackTitle,
          headerBlurEffect: 'regular',
          headerTransparent: Platform.select({
            ios: true,
            default: false,
          }),
        }}
      />
      <Container>
        <EntryList
          feedIdList={[]}
          collectedOnly={collected === 'true'}
          view={Number(view) as TabViewIndex}
        />
      </Container>
    </>
  )
}
