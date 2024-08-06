import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSWR from 'swr'

import { getSession, saveSessionToUserTable } from '~/api/session'
import { Button, Text } from '~/components'

export default function Auth() {
  const router = useRouter()
  const searchParams = useLocalSearchParams()
  const { error, isLoading } = useSWR<void, Error, ['sign-in', string | string[] | null]>(
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
      onSuccess(data) {
        // eslint-disable-next-line no-console
        console.log('sign success', data)
        router.navigate('/')
      },
    },
  )

  if (error) {
    return (
      <SafeAreaView>
        <Text>{error.message}</Text>
        <Button
          onPress={() => {
            router.replace('/sign-in')
          }}
        >
          <Text>
            Back to Sign In
          </Text>
        </Button>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <Text>Auth screen...</Text>
      <Button
        onPress={() => {
          router.replace('/')
        }}
      >
        <Text>
          Back Home
        </Text>
      </Button>
    </SafeAreaView>
  )
}
