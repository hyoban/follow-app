import { Container } from '~/components'
import { FeedList } from '~/components/feed-list'

export default function Page() {
  return (
    <>
      <Container>
        <FeedList view={5} />
      </Container>
    </>
  )
}
