import { Stack, useLocalSearchParams } from 'expo-router'
import { useSetAtom } from 'jotai'
import { Pressable } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { toggleUnreadOnlyFeedIdListAtom } from '~/atom/entry-list'
import { Iconify } from '~/components'
import { EntryList } from '~/components/entry-list'
import { useEntryList, useShowUnreadOnly } from '~/hooks/use-entry-list'
import { useTabTitle } from '~/hooks/use-tab-title'

export default function Page() {
  const { theme } = useStyles()
  const [title] = useTabTitle()

  const { feedId: feedIdList } = useLocalSearchParams<{ feedId: string[] }>()
  const showUnreadOnly = useShowUnreadOnly(feedIdList ?? [])
  const { data: entryList } = useEntryList(feedIdList ?? [])

  const toggleUnreadOnlyFeedIdList = useSetAtom(toggleUnreadOnlyFeedIdListAtom)

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: entryList?.at(0)?.feed.category ?? entryList?.at(0)?.feed.title ?? 'Feed',
          headerBackTitle: title,
          headerTitleStyle: {
            color: theme.colors.gray12,
          },
          headerStyle: {
            backgroundColor: theme.colors.gray2,
          },
          headerRight: () => (
            <Pressable
              onPress={() => {
                toggleUnreadOnlyFeedIdList(feedIdList ?? [])
                  .catch(console.error)
              }}
            >
              {showUnreadOnly
                ? <Iconify icon="mingcute:document-fill" />
                : <Iconify icon="mingcute:document-line" />}
            </Pressable>
          ),
        }}
      />
      <EntryList feedIdList={feedIdList ?? []} />
    </>
  )
}
