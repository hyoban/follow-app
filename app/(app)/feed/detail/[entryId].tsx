import { inArray } from 'drizzle-orm'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import type { DimensionValue } from 'react-native'
import { ScrollView } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useStyles } from 'react-native-unistyles'
import WebView from 'react-native-webview'

import { loadEntryContent, markEntryAsRead } from '~/api/entry'
import { Container, Text } from '~/components'
import { simpleCSS } from '~/consts/css'
import { db } from '~/db'
import { entries } from '~/db/schema'
import { useQuerySubscription } from '~/hooks/use-query-subscription'

export default function FeedDetail() {
  const { entryId, feedId } = useLocalSearchParams<{ entryId: string, feedId: string }>()
  const feedIdList = feedId.split(',')
  const { data: entryList } = useQuerySubscription(
    db.query.entries.findMany({
      where: inArray(entries.feedId, feedIdList),
      orderBy(fields, { desc }) {
        return [desc(fields.publishedAt)]
      },
      with: {
        feed: true,
      },
    }),
    [feedId, entryId],
  )
  const { theme } = useStyles()
  const data = entryList?.find(entry => entry.id === entryId)

  if (!entryId || typeof entryId !== 'string')
    return null

  return (
    <>
      <Stack.Screen options={{
        headerTitle: '',
        headerStyle: {
          backgroundColor: theme.colors.gray2,
        },
        headerTitleStyle: {
          color: theme.colors.gray12,
        },
      }}
      />
      <Container style={{ backgroundColor: theme.colors.gray1 }}>
        <PagerView
          style={{ flex: 1 }}
          initialPage={entryList?.findIndex(i => i.id === data?.id)}
          onPageSelected={(e) => {
            const { position } = e.nativeEvent
            const entry = entryList?.[position]

            if (entry && !entry.content) {
              loadEntryContent(entry.id)
                .catch(console.error)
            }

            if (entry && !entry.read) {
              markEntryAsRead(entry.id, entry.feed)
                .catch(console.error)
            }
          }}
        >
          {entryList?.map(entry => (
            <ScrollView key={entry.id}>
              <Text size={20} weight={600} style={{ padding: 20 }}>
                {entry?.title}
              </Text>
              <WebViewAutoHeight
                html={entry?.content ?? ''}
              />
            </ScrollView>
          ))}
        </PagerView>
      </Container>
    </>
  )
}

function WebViewAutoHeight({ html }: { html: string }) {
  const [height, setHeight] = useState<DimensionValue>()

  return (
    <WebView
      scrollEnabled={false}
      style={{ height }}
      originWhitelist={['*']}
      injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
      onMessage={(e) => {
        setHeight(Number.parseInt(e.nativeEvent.data, 10))
      }}
      source={{
        baseUrl: '',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My New Website</title>
    <style>
      ${simpleCSS}
    </style>
</head>
<body>
  <div>${html}</div>
</body>
</html>
        `,
      }}
    />
  )
}
