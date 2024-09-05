import { Platform, ToastAndroid } from 'react-native'
import type { ToastOptions as ToastOptionsExternal } from 'react-native-toast-notifications'
import { Toast } from 'react-native-toast-notifications'

export type ToastOptions = Exclude<ToastOptionsExternal, 'duration'> & {
  duration?: 'short' | 'long'
}

export function toast(message: string, options: ToastOptions = {}) {
  let duration: number
  if (Platform.OS === 'android') {
    duration = options.duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG
    const gravity
      = options.placement === 'top'
        ? ToastAndroid.TOP
        : options.placement === 'bottom'
          ? ToastAndroid.BOTTOM
          : options.placement === 'center'
            ? ToastAndroid.CENTER
            : ToastAndroid.BOTTOM

    ToastAndroid.showWithGravity(message, duration, gravity)
    return
  }
  else {
    duration = options.duration === 'short' ? 2000 : 3500
  }

  Toast.show(message, options)
}
