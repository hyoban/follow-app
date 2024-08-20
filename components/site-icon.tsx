import type { ImageProps } from 'expo-image'
import { parse } from 'tldts'

import { Image } from '~/components/image'

import { Iconify } from './icon'

export function SiteIcon(props: ImageProps & { size?: number }) {
  let host: string
  let src: string
  let fallback: string
  const url = typeof props.source === 'object'
    ? Array.isArray(props.source)
      ? typeof props.source[0] === 'object'
        ? props.source[0].uri
        : props.source[0]
      : props.source && 'uri' in props.source
        ? props.source?.uri
        : null
    : typeof props.source === 'string'
      ? props.source
      : null

  const size = props.size ?? 24

  if (!url) {
    return (
      <Iconify
        icon="mingcute:rss-fill"
        style={{ width: size, height: size, borderRadius: size / 4 }}
      />
    )
  }

  try {
    host = new URL(url).host
    const pureDomain = parse(host).domainWithoutSuffix
    fallback = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain?.slice(0, 2).toUpperCase()}`
    src = `https://unavatar.follow.is/${host}?fallback=${fallback}`
  }
  catch {
    const pureDomain = parse(url).domainWithoutSuffix
    src = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain?.slice(0, 2).toUpperCase()}`
  }

  return (
    <Image
      {...props}
      source={{ uri: src }}
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        props.style,
      ]}
    />
  )
}
