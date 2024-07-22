import { Stack } from 'expo-router'

import { Flex, Text } from '~/components'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <Flex flex={1} p={20}>
        <Text>This is Page Two</Text>
      </Flex>
    </>
  )
}
