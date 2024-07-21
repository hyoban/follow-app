import { Stack } from 'expo-router'
import { YStack } from 'tamagui'

import { ScreenContent } from '~/components/ScreenContent'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <YStack flex={1} padding={24}>
        <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
      </YStack>
    </>
  )
}
