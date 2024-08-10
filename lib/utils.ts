import { Linking } from 'react-native'
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
