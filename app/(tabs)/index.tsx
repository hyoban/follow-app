import { Stack } from 'expo-router'
import { UnistylesRuntime, useStyles } from 'react-native-unistyles'

import { Button, Container, Row, Text } from '~/components'
import { accentColors, getAccentColor } from '~/theme'

const accentColorGroups = Array.from(
  { length: accentColors.length / 4 },
  (_, i) => {
    const start = i * 4
    return accentColors.slice(start, start + 4)
  },
)

export default function Home() {
  const { theme } = useStyles()
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container p={20} direction="column" gap={10} bg={theme.colors.accent5}>
        {accentColorGroups.map((accentColors, i) => (
          <Row key={i} gap={10} bg={theme.colors.accent5}>
            {accentColors.map(accentColor => (
              <Button
                key={accentColor}
                color={accentColor}
                onPress={() => {
                  const {
                    accent,
                    accentA,
                    accentDark,
                    accentDarkA,
                  } = getAccentColor(
                    accentColor,
                  )
                  UnistylesRuntime.updateTheme(
                    UnistylesRuntime.themeName,
                    oldTheme => ({
                      ...oldTheme,
                      colors: {
                        ...oldTheme.colors,
                        ...accent,
                        ...accentA,
                        ...accentDark,
                        ...accentDarkA,
                      },
                    }),
                  )
                }}
              >
                <Text color={accentColor}>
                  {accentColor}
                </Text>
              </Button>
            ))}
          </Row>
        ))}
      </Container>
    </>
  )
}
