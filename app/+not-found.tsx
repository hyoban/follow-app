import { Link, Stack } from 'expo-router';
import { YStack } from 'tamagui';

import { Container, Main, Subtitle, Title } from '../tamagui.config';

export default function NotFoundScreen() {
  return (
    <Container>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Main>
        <YStack>
          <Title>This screen doesn't exist.</Title>
          <Link href="/">
            <Subtitle>Go to home screen!</Subtitle>
          </Link>
        </YStack>
      </Main>
    </Container>
  );
}
