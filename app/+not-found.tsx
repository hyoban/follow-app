import { Link, Stack } from 'expo-router'
import { View } from 'react-native'

export default function NotFoundScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack>
        <Stack.Screen name="not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <Link href="/">Go back home</Link>
    </View>
  )
}
