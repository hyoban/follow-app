import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStyles } from 'react-native-unistyles'
import useSWR from 'swr'

import { getSession, saveSessionToUserTable } from '~/api/session'
import { Button, Column, Container, Text } from '~/components'
import { commonStylesheet } from '~/theme/common'

function obtainAuthToken() {
  return new Promise<string>((resolve) => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const { hostname, queryParams } = Linking.parse(url)
      if (hostname === 'auth' && queryParams !== null && typeof queryParams.token === 'string') {
        WebBrowser.dismissBrowser()
        InAppBrowser.close()
        const { token } = queryParams
        resolve(token)
        subscription.remove()
      }
    })

    InAppBrowser.isAvailable()
      .then((isAvailable) => {
        if (!isAvailable) {
          WebBrowser.openBrowserAsync(process.env.EXPO_PUBLIC_FOLLOW_LOGIN_URL)
            .catch(console.error)
        }
        InAppBrowser.open(process.env.EXPO_PUBLIC_FOLLOW_LOGIN_URL)
          .catch(console.error)
      })
      .catch(console.error)
  })
}

export default function Auth() {
  const router = useRouter()
  const searchParams = useLocalSearchParams()
  const { isLoading } = useSWR<void, Error, ['sign-in', string | string[] | null]>(
    ['sign-in', searchParams?.token ?? null],
    ([_, token]) => {
      if (!token || Array.isArray(token))
        throw new Error('has not token')
      return new Promise((resolve, reject) => {
        getSession(token)
          .then((session) => {
            saveSessionToUserTable(session)
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject(new Error('Failed to save session'))
              })
          })
          .catch(() => {
            reject(new Error('Failed to get session'))
          })
      })
    },
    {
      onSuccess() {
        router.replace('/')
      },
    },
  )

  const { styles } = useStyles(commonStylesheet)
  return (
    <SafeAreaView style={styles.appBackground}>
      <Container align="center" px={20}>
        <Column flex={1} justify="center">
          <Image
            source={require('~/assets/icon.png')}
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
            }}
          />
        </Column>
        <Column w="100%" gap={8} flex={1} pt={60}>
          <Button
            fullWidth
            radius="full"
            onPress={async () => {
              await obtainAuthToken()
            }}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <Text weight="bold">Sign in</Text>
          </Button>
          <Text size={14} style={{ textAlign: 'center' }}>
            Use your personal account to sign in on web.follow.is
          </Text>
        </Column>
      </Container>
    </SafeAreaView>
  )
}
