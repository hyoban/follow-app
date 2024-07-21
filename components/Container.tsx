import { YStack } from 'tamagui'

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <YStack flex={1} padding="$6">
      {children}
    </YStack>
  )
}
