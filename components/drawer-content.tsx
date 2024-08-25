import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStyles } from 'react-native-unistyles'

import type { TabViewIndex } from '~/store/layout'

import { FeedList } from './feed-list'
import { Row } from './flex'
import { Iconify } from './icon'

export function DrawerContent({ state }: DrawerContentComponentProps) {
  const tabRoutes = state.routes[state.index]?.state?.routes
  const currentTabIndex = tabRoutes?.[0]?.state?.index ?? 0
  const router = useRouter()
  const { theme } = useStyles()

  return (
    <SafeAreaView
      style={{
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: theme.colors.gray1,
      }}
    >
      <ScrollView>
        <FeedList view={currentTabIndex as TabViewIndex} inDrawer />
      </ScrollView>
      <Row px={20} my={20} gap={20}>
        <Pressable
          onPress={() => router.push('/settings')}
        >
          <Iconify icon="mgc:settings-7-cute-re" />
        </Pressable>
        <Pressable
          onPress={() => router.push('/discover')}
        >
          <Iconify icon="mgc:add-cute-re" />
        </Pressable>
      </Row>
    </SafeAreaView>
  )
}
