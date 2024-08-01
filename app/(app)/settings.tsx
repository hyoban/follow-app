import { eq } from 'drizzle-orm'
import { Image } from 'expo-image'
import { Redirect, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { UnistylesRuntime, useStyles } from 'react-native-unistyles'

import { Button, Column, Row, Text } from '~/components'
import { db } from '~/db'
import { users } from '~/db/schema'
import { useQuerySubscription } from '~/hooks/use-query-subscription'
import { accentColors, getAccentColor } from '~/theme'

const accentColorGroups = Array.from(
  { length: accentColors.length / 4 },
  (_, i) => {
    const start = i * 4
    return accentColors.slice(start, start + 4)
  },
)

function ThemeSwitcher() {
  const { theme } = useStyles()
  return accentColorGroups.map((accentColors, i) => (
    <Row key={i} gap={10} bg={theme.colors.accent5} style={{ display: 'none' }}>
      {accentColors.map(accentColor => (
        <Button
          key={accentColor}
          color={accentColor}
          onPress={() => {
            const { accent, accentA, accentDark, accentDarkA }
              = getAccentColor(accentColor)
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
          <Text color={accentColor}>{accentColor}</Text>
        </Button>
      ))}
    </Row>
  ))
}

export default function UserInfo() {
  const router = useRouter()
  const { data: user } = useQuerySubscription(db.query.users.findFirst(), 'current-user')

  if (!user)
    return <Redirect href="/sign-in" />

  return (
    <>
      <Column flex={1} p={20}>
        <Column flex={1} gap={20} align="stretch" w="100%">
          <Row
            gap={24}
            align="center"
          >
            <Image
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
              }}
              source={user.image}
            />
            <Column gap={8}>
              <Text weight="700">
                {user.name}
              </Text>
              <Text>
                {user.email}
              </Text>
            </Column>
          </Row>
          <Button
            fullWidth
            color="red"
            onPress={async () => {
              await db.delete(users).where(eq(users.id, user.id))
              router.navigate('/')
            }}
          >
            <Text color="red">Logout</Text>
          </Button>
        </Column>

        <ThemeSwitcher />
      </Column>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  )
}
