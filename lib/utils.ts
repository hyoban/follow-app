import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'
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

const imageRefererMatches = [
  {
    url: /^https:\/\/\w+\.sinaimg.cn/,
    referer: 'https://weibo.com',
  },
  {
    url: /^https:\/\/i\.pximg\.net/,
    referer: 'https://www.pixiv.net',
  },
  {
    url: /^https:\/\/cdnfile\.sspai\.com/,
    referer: 'https://sspai.com',
  },
]

function getProxyUrl({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) {
  return `${process.env.EXPO_PUBLIC_IMGPROXY_URL}/unsafe/${width}x${height}/${encodeURIComponent(url)}`
}

export function replaceImgUrlIfNeed({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) {
  const httpsUrl = url.replace(/^http:/, 'https:')

  for (const rule of imageRefererMatches) {
    if (rule.url.test(httpsUrl)) {
      return getProxyUrl({ url: httpsUrl, width, height })
    }
  }
  return httpsUrl
}

export async function readability(url: string) {
  const documentString = await fetch(url).then(res => res.text())

  // FIXME: linkedom does not handle relative addresses in strings. Refer to
  // @see https://github.com/WebReflection/linkedom/issues/153
  // JSDOM handles it correctly, but JSDOM introduces canvas binding.

  const { document } = parseHTML(documentString)
  const baseUrl = new URL(url).origin

  document.querySelectorAll('a').forEach((a) => {
    a.href = replaceRelativeAddress(baseUrl, a.href)
  });

  (['img', 'audio', 'video'] as const).forEach((tag) => {
    document.querySelectorAll(tag).forEach((img) => {
      img.src = img.src && replaceRelativeAddress(baseUrl, img.src)
    })
  })

  const reader = new Readability(document)
  return reader.parse()
}

function replaceRelativeAddress(baseUrl: string, url: string) {
  if (url.startsWith('http')) {
    return url
  }
  return new URL(url, baseUrl).href
}
