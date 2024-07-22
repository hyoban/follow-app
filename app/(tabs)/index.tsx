import { Stack } from 'expo-router'

import { Flex, Text } from '~/components'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Flex flex={1} p={20}>
        <Text>Hi!</Text>
      </Flex>
    </>
  )
}
