import { Image } from './image'
import { SiteIcon } from './site-icon'

export function SiteImage({ feed, size = 24 }: { feed: { image?: string | null, siteUrl?: string | null }, size?: number }) {
  return feed?.image
    ? (
        <Image
          source={{ uri: feed.image }}
          style={{ width: size, height: size, borderRadius: size / 4 }}
        />
      )
    : (
        <SiteIcon source={feed?.siteUrl} size={size} />
      )
}
