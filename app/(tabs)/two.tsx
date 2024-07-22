import { Stack } from 'expo-router'

import { Container, Text } from '~/components'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <Container p={20}>
        <Text>This is Page Two</Text>
      </Container>
    </>
  )
}
