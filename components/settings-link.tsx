import { Link } from 'expo-router'
import { Pressable } from 'react-native'

import { Image } from '~/components/image'
import { useCurrentUser } from '~/hooks/use-current-user'

export function SettingsLink() {
  const { user } = useCurrentUser()
  return (
    <Link href="/settings" asChild>
      <Pressable>
        {({ pressed }) => (
          user
            ? (
                <Image
                  source={user?.image}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    opacity: pressed ? 0.5 : 1,
                  }}
                />
              )
            : null
        )}
      </Pressable>
    </Link>
  )
}
