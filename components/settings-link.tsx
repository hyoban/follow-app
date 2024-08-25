import { DrawerActions } from '@react-navigation/native'
import { Link, useNavigation } from 'expo-router'
import { Pressable } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { Image } from '~/components/image'
import { useCurrentUser } from '~/hooks/use-current-user'
import { isTablet } from '~/theme/breakpoints'

import { Iconify } from './icon'

function DrawerOpenButton({ size = 24 }: { size?: number }) {
  const navigation = useNavigation()
  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Iconify icon="mingcute:menu-line" size={size} />
    </Pressable>
  )
}

function NavigationButton({ size = 24 }: { size?: number }) {
  const { user } = useCurrentUser()
  if (!user)
    return null
  return (
    <Link href="/settings" asChild>
      <Pressable>
        {({ pressed }) => (
          <Image
            source={user?.image}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: pressed ? 0.5 : 1,
            }}
          />
        )}
      </Pressable>
    </Link>
  )
}

export function SettingsLink({ size = 24 }: { size?: number }) {
  const { breakpoint } = useStyles()
  return isTablet(breakpoint)
    ? <NavigationButton size={size} />
    : <DrawerOpenButton size={size} />
}
