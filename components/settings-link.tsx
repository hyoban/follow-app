import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable } from 'react-native'

import { db } from '~/db'
import { useQuerySubscription } from '~/hooks/use-query-subscription'

import { Iconify } from './icon'

export function SettingsLink() {
  const { data: user } = useQuerySubscription(db.query.users.findFirst(), 'current-user')
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
            : (
                <Iconify
                  icon="mingcute:user-4-fill"
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )
        )}
      </Pressable>
    </Link>
  )
}
