import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'
import useSWR from 'swr'
import { Button, Image, Text, XStack, YStack } from 'tamagui'

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
      Toast.show({ text1: 'You have successfully logged in.' })
    }
  })
  await WebBrowser.openBrowserAsync('https://dev.follow.is/login')
}

export default function UserInfo() {
  const { data: session, mutate } = useSession()

  return (
    <>
      <YStack flex={1} padding={20}>
        {session ? (
          <YStack gap={20}>
            <XStack
              gap={24}
              alignItems="center"
            >
              <Image
                source={{
                  uri: session.user.image,
                  height: 100,
                  width: 100,
                }}
                borderRadius={50}
              />
              <YStack gap={8}>
                <Text color="$color12" fontSize="$8" fontWeight="600">
                  {session.user.name}
                </Text>
                <Text color="$color12" fontSize="$5">
                  {session.user.email}
                </Text>
              </YStack>
            </XStack>
            <Button
              onPress={async () => {
                await SecureStore.deleteItemAsync(SECURE_AUTH_TOKEN_KEY)
                mutate()
              }}
            >
              Logout
            </Button>
          </YStack>
        ) : (
          <Button onPress={handlePressButtonAsync}>
            Login
          </Button>
        )}
      </YStack>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  )
}
