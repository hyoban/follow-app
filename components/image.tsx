import type { ImageProps } from 'expo-image'
import { Image as ExpoImage } from 'expo-image'

import { replaceImgUrlIfNeed } from '~/lib/utils'

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

export function Image({ source, proxy, ...rest }: ImageProps & { proxy?: { width: number, height: number } }) {
  const proxyWidth = proxy?.width ?? 0
  const proxyHeight = proxy?.height ?? 0
  const finalSource = typeof source === 'string'
    ? replaceImgUrlIfNeed({ url: source, width: proxyWidth, height: proxyHeight })
    : typeof source === 'object' && source != null && 'uri' in source && source.uri != null
      ? {
          ...source,
          uri: replaceImgUrlIfNeed({ url: source.uri, width: proxyWidth, height: proxyHeight }),
        }
      : source

  return (
    <ExpoImage
      source={finalSource}
      placeholder={{ blurhash }}
      {...rest}
    />
  )
}
