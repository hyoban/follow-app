import { Stack, useLocalSearchParams } from 'expo-router'
import { useSetAtom } from 'jotai'
import { Pressable } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { toggleUnreadOnlyListAtom } from '~/atom/entry-list'
import { Iconify } from '~/components'
import { EntryList } from '~/components/entry-list'
import { useShowUnreadOnly } from '~/hooks/use-entry-list'
import { useTab } from '~/hooks/use-tab-title'

export default function Page() {
  const { theme } = useStyles()
  const { title: headerBackTitle } = useTab()

  const { feedId: feedIdList, title: headerTitle } = useLocalSearchParams<{ feedId: string[], title: string }>()
  const showUnreadOnly = useShowUnreadOnly(feedIdList ?? [])

  const toggleUnreadOnlyList = useSetAtom(toggleUnreadOnlyListAtom)

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle,
          headerBackTitle,
          headerTitleStyle: {
            color: theme.colors.gray12,
          },
          headerStyle: {
            backgroundColor: theme.colors.gray2,
          },
          headerRight: () => (
            <Pressable
              onPress={() => {
                if (!feedIdList)
                  return
                toggleUnreadOnlyList(feedIdList)
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
