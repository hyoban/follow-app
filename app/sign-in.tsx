import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { SafeAreaView } from 'react-native-safe-area-context'

import { getSession, saveSessionToUserTable } from '~/api/session'
import { Button, Text } from '~/components'

function handlePressButtonAsync() {
  return new Promise<void>((resolve) => {
    Linking.addEventListener('url', ({ url }) => {
      const { hostname, queryParams } = Linking.parse(url)
      if (hostname === 'auth' && queryParams !== null && typeof queryParams.token === 'string') {
        WebBrowser.dismissBrowser()
        const { token } = queryParams
        getSession(token)
          .then((session) => {
            saveSessionToUserTable(session)
              .then(() => {
                resolve()
              })
              .catch(() => {
                console.error('Failed to save session')
              })
          })
          .catch(() => {
            console.error('Failed to get session')
          })
      }
    })
    void WebBrowser.openBrowserAsync(process.env.EXPO_PUBLIC_FOLLOW_LOGIN_URL)
  })
}

export default function SignIn() {
  const router = useRouter()
  return (
    <SafeAreaView>
      <Button
        fullWidth
        onPress={async () => {
          await handlePressButtonAsync()
          router.replace('/')
        }}
      >
        <Text>Login</Text>
      </Button>
    </SafeAreaView>
  )
}
