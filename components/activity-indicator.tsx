import { useEffect } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { useStyles } from 'react-native-unistyles'

import { IconLoading3CuteRe } from './icons'

const duration = 2000
const easing = Easing.bezier(0.25, -0.5, 0.25, 1)

export function ActivityIndicator({ color, size = 24 }: { color?: 'text' | 'accent', size?: number }) {
  const { theme } = useStyles()
  const sv = useSharedValue<number>(0)

  useEffect(() => {
    sv.value = withRepeat(withTiming(1, { duration, easing }), -1)
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }))

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <IconLoading3CuteRe
        width={size}
        height={size}
        color={color === 'accent' ? theme.colors.accentContrast : theme.colors.gray12}
      />
    </Animated.View>
  )
}
