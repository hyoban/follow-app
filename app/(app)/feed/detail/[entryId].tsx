import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import type { DimensionValue } from 'react-native'
import { ActivityIndicator, ScrollView } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useStyles } from 'react-native-unistyles'
import WebView from 'react-native-webview'

import { flagEntryReadStatus, loadEntryContent } from '~/api/entry'
import { Container, Text } from '~/components'
import { simpleCSS } from '~/consts/css'
import { useEntryList } from '~/hooks/use-entry-list'

function LazyComponent({
  componentKey,
  currentKey,
  children,
  placeholder,
}: {
  componentKey: string
  currentKey: string
  children: React.ReactNode
  placeholder?: React.ReactNode
}) {
  const [hasRendered, setHasRendered] = useState(false)

  useEffect(() => {
    if (!hasRendered && currentKey === componentKey)
      setHasRendered(true)
  }, [currentKey, componentKey, hasRendered])

  if (hasRendered)
    return children
  return placeholder || <></>
}

export default function FeedDetail() {
  const { entryId, feedId } = useLocalSearchParams<{ entryId: string, feedId: string }>()
  const feedIdList = useMemo(() => feedId.split(','), [feedId])
  const { data: entryList } = useEntryList(feedIdList)
  const { theme } = useStyles()
  const entryIndex = entryList?.findIndex(i => i.id === entryId)
  const [currentPageIndex, setCurrentPageIndex] = useState(entryIndex)
  const currentEntry = useMemo(() => currentPageIndex ? entryList?.at(currentPageIndex) : null, [entryList, currentPageIndex])

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
      <Container style={{ flex: 1, backgroundColor: theme.colors.gray1 }}>
        <PagerView
          style={{ flex: 1 }}
          initialPage={entryIndex}
          onPageSelected={(e) => {
            const { position } = e.nativeEvent
            setCurrentPageIndex(position)
            const entry = entryList?.[position]

            if (entry && !entry.content) {
              loadEntryContent(entry.id)
                .catch(console.error)
            }

            if (entry && !entry.read) {
              flagEntryReadStatus(entry.id, entry.feed)
                .catch(console.error)
            }
          }}
        >
          {entryList?.map(entry => (
            <LazyComponent
              key={entry.id}
              componentKey={entry.id}
              currentKey={currentEntry?.id ?? ''}
              placeholder={<ActivityIndicator />}
            >
              <ScrollView>
                <Text size={20} weight={600} style={{ padding: 20 }}>
                  {entry?.title}
                </Text>
                <WebViewAutoHeight
                  html={entry?.content ?? ''}
                />
              </ScrollView>
            </LazyComponent>
          ))}
        </PagerView>
      </Container>
    </>
  )
}

function WebViewAutoHeight({ html }: { html: string }) {
  const [height, setHeight] = useState<DimensionValue>('auto')

  if (!html) {
    return <ActivityIndicator />
  }

  return (
    <>
      {!height && <ActivityIndicator />}
      <WebView
        scrollEnabled={false}
        style={{
          height,
          display: height ? 'flex' : 'none',
        }}
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
    </>
  )
}
