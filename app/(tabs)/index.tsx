import { Stack } from 'expo-router'

import { Container, Text } from '~/components'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container p={20}>
        <Text>Hi!</Text>
      </Container>
    </>
  )
}
