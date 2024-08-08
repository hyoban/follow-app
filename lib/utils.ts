import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'

export async function openExternalUrl(url?: string | null) {
  if (!url)
    return
  if (await InAppBrowser.isAvailable()) {
    await InAppBrowser.open(
      url,
      {
        modalEnabled: false,
        animated: true,
      },
    )
  }
  else {
    await Linking.openURL(url)
  }
}
