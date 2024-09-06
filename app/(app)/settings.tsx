import { useAtom, useSetAtom } from 'jotai'
import { ScrollView, useColorScheme } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Button, Column, Container, Divider, Iconify, Row, Switch, Text, TextButton } from '~/components'
import { Image } from '~/components/image'
import { useCurrentUser } from '~/hooks/use-current-user'
import { useLogOut } from '~/hooks/use-log-out'
import { markAsReadOnScrollAtom } from '~/store/settings'
import { accentColorAtom, userThemeAtom } from '~/store/theme'
import { accentColors } from '~/theme'

function ThemeSwitcher() {
  const setSelectedAccentColor = useSetAtom(accentColorAtom)

  return (
    <Row align="center" gap={30}>
      <Text>Accent color</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {accentColors.map(accentColor => (
          <Button
            key={accentColor}
            color={accentColor}
            size="small"
            onPress={() => {
              setSelectedAccentColor(accentColor)
            }}
          >
            <Text color={accentColor}>{accentColor}</Text>
          </Button>
        ))}
      </ScrollView>
    </Row>
  )
}

function Appearance() {
  const { styles } = useStyles(styleSheet)
  const [userTheme, setUserTheme] = useAtom(userThemeAtom)
  const colorScheme = useColorScheme()
  return (
    <Column gap={10}>
      <Row align="center" gap={8} px={12}>
        <Iconify icon="mgc:palette-cute-re" size={20} />
        <Text weight="bold">Appearance</Text>
      </Row>
      <Column style={styles.section}>
        <ThemeSwitcher />
        <Divider type="horizontal" />
        <Row justify="space-between" align="center">
          <Text>Follow system</Text>
          <Switch
            value={userTheme === 'system'}
            onValueChange={
              value => setUserTheme(value ? 'system' : colorScheme === 'dark' ? 'dark' : 'light')
            }
          />
        </Row>
        {userTheme !== 'system' && (
          <>
            <Divider type="horizontal" />
            <Row justify="space-between" align="center">
              <Text>Dark mode</Text>
              <Switch
                value={userTheme === 'dark'}
                onValueChange={
                  value => setUserTheme(value ? 'dark' : 'light')
                }
              />
            </Row>
          </>
        )}
      </Column>
    </Column>
  )
}

function UserInfo() {
  const { styles } = useStyles(styleSheet)

  const { user } = useCurrentUser()
  const logout = useLogOut()

  return (
    <Column gap={10}>
      <Row align="center" gap={8} px={12}>
        <Iconify icon="mgc:user-setting-cute-re" size={20} />
        <Text weight="bold">Profile</Text>
      </Row>
      <Column style={styles.section}>
        {user && (
          <>
            <Row
              gap={24}
              align="center"
              my={10}
            >
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
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
            <TextButton
              color="red"
              onPress={logout}
              title="Sign out"
              style={{ width: '100%', marginBottom: 10 }}
            />
          </>
        )}
      </Column>
    </Column>
  )
}

function General() {
  const { styles } = useStyles(styleSheet)
  const [markAsReadOnScroll, setMarkAsReadOnScroll] = useAtom(markAsReadOnScrollAtom)

  return (
    <Column gap={10}>
      <Row align="center" gap={8} px={12}>
        <Iconify icon="mgc:settings-7-cute-re" size={20} />
        <Text weight="bold">General</Text>
      </Row>
      <Column px={12}>
        <Text>Unread</Text>
      </Column>
      <Column style={styles.section}>
        <Column gap={4}>
          <Row justify="space-between" align="center">
            <Text>Mark as read when scrolling</Text>
            <Switch
              value={markAsReadOnScroll}
              onValueChange={(value) => {
                setMarkAsReadOnScroll(value)
              }}
            />
          </Row>
          <Text contrast="low" size={14}>Automatically mark entries as read when scrolled out of the view.</Text>
        </Column>
      </Column>
    </Column>
  )
}

export default function SettingsPage() {
  return (
    <Container p={14} gap={20}>
      <General />
      <Appearance />
      <UserInfo />
    </Container>
  )
}

const styleSheet = createStyleSheet(theme => ({
  section: {
    backgroundColor: theme.colors.gray2,
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: theme.colors.gray3,
    borderWidth: 1,
  },
}))
