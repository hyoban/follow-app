import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import { StatusBar } from 'expo-status-bar'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { Platform } from 'react-native'

import { getSession, saveSessionToUserTable } from '~/api/session'
import { Button, Column, Row, Text } from '~/components'
import { db } from '~/db'
import { users } from '~/db/schema'

async function handlePressButtonAsync() {
  Linking.addEventListener('url', ({ url }) => {
    const { hostname, queryParams } = Linking.parse(url)
    if (hostname === 'auth' && queryParams !== null && typeof queryParams.token === 'string') {
      WebBrowser.dismissBrowser()
      const { token } = queryParams
      getSession(token)
        .then((session) => {
          saveSessionToUserTable(session)
            .catch(() => {
              console.error('Failed to save session')
            })
        })
        .catch(() => {
          console.error('Failed to get session')
        })
    }
  })
  await WebBrowser.openBrowserAsync('https://dev.follow.is/login')
}

export default function UserInfo() {
  const { data: user } = useLiveQuery(db.query.users.findFirst())

  return (
    <>
      <Column flex={1} p={20}>
        {user ? (
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
                <Text weight="700" size={5}>
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
              }}
            >
              <Text color="red">Logout</Text>
            </Button>
          </Column>
        ) : (
          <Button fullWidth onPress={handlePressButtonAsync}>
            <Text>Login</Text>
          </Button>
        )}
      </Column>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  )
}
