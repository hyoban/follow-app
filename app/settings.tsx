import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { Platform } from 'react-native'
import useSWR from 'swr'

import { Button, Column, Row, Text } from '~/components'

const SECURE_AUTH_TOKEN_KEY = 'secure-auth-token'

interface Session {
  expires: string
  invitation: Invitation
  sessionToken: string
  user: User
  userId: string
}

interface Invitation {
  code: string
  createdAt: string
  fromUserId: string
  toUserId: string
}

interface User {
  createdAt: string
  email: string
  emailVerified: any
  handle: string
  id: string
  image: string
  name: string
}

function useSession() {
  return useSWR('https://api.dev.follow.is/auth/session', async (url) => {
    const authToken = await SecureStore.getItemAsync(SECURE_AUTH_TOKEN_KEY)
    const response = await fetch(url, {
      headers: {
        cookie: `authjs.session-token=${authToken}`,
      },
      credentials: 'omit',
    })
    const data = (await response.json()) as Session
    return data
  })
}

async function handlePressButtonAsync() {
  Linking.addEventListener('url', ({ url }) => {
    const { hostname, queryParams } = Linking.parse(url)
    if (hostname === 'auth' && queryParams !== null && typeof queryParams.token === 'string') {
      WebBrowser.dismissBrowser()
      if (Platform.OS !== 'web') {
        SecureStore.setItemAsync(SECURE_AUTH_TOKEN_KEY, queryParams.token)
      }
    }
  })
  await WebBrowser.openBrowserAsync('https://dev.follow.is/login')
}

export default function UserInfo() {
  const { data: session, mutate } = useSession()

  return (
    <>
      <Column flex={1} p={20}>
        {session ? (
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
                source={session.user.image}
              />
              <Column gap={8}>
                <Text weight="700" size={5}>
                  {session.user.name}
                </Text>
                <Text>
                  {session.user.email}
                </Text>
              </Column>
            </Row>
            <Button
              color="red"
              onPress={async () => {
                await SecureStore.deleteItemAsync(SECURE_AUTH_TOKEN_KEY)
                mutate()
              }}
            >
              <Text color="red">Logout</Text>
            </Button>
          </Column>
        ) : (
          <Button
            style={{
              width: '100%',
              alignItems: 'center',
            }}
            onPress={handlePressButtonAsync}
          >
            <Text>Login</Text>
          </Button>
        )}
      </Column>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  )
}
