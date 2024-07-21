import { H2, Separator, Theme, YStack } from 'tamagui'

import { EditScreenInfo } from './EditScreenInfo'

type ScreenContentProps = {
  title: string
  path: string
  children?: React.ReactNode
}

export function ScreenContent({ title, path, children }: ScreenContentProps) {
  return (
    <Theme name="light">
      <YStack flex={1} alignItems="center" justifyContent="center">
        <H2>{title}</H2>
        <Separator />
        <EditScreenInfo path={path} />
        {children}
      </YStack>
    </Theme>
  )
}
