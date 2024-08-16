import type { TextStyle } from 'react-native'
import { Linking, Platform } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'

export async function openExternalUrl(
  url?: string | null,
  options?: { inApp: boolean },
) {
  if (!url)
    return
  const inApp = options?.inApp ?? true
  if (await InAppBrowser.isAvailable() && inApp) {
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

const regexToMatchDeepLink = [
  {
    regexp: /^https:\/\/t.bilibili.com\/(\d+)/,
    getDeepLink: (id: string) => `bilibili://following/detail/${id}`,
  },
]

export function getDeepLinkUrl(url: string) {
  for (const { regexp, getDeepLink } of regexToMatchDeepLink) {
    const match = url.match(regexp)
    if (match && match[1]) {
      return getDeepLink(match[1])
    }
  }
  return url
}

export function getFontFamily(
  fontWeight?: TextStyle['fontWeight'],
  fontStyle?: TextStyle['fontStyle'],
) {
  if (Platform.OS === 'ios') {
    return 'SN Pro'
  }

  let fontFamily = 'SNPro-Regular'
  if (fontWeight && ['bold', 600, 700].includes(fontWeight)) {
    fontFamily = 'SNPro-Bold'
  }

  if (fontStyle === 'italic') {
    fontFamily += 'Italic'
  }
  return fontFamily
}
