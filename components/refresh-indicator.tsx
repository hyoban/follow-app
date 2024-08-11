import { useHeaderHeight } from '@react-navigation/elements'
import { Pressable } from 'react-native'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { useStyles } from 'react-native-unistyles'
import useSWR from 'swr'

import { apiClient } from '~/api/client'
import { db } from '~/db'
import { useQuerySubscription } from '~/hooks/use-query-subscription'

import { Iconify, Row, Text } from '.'

export function RefreshIndicator({
  feedIdList,
  onRefresh,
}: {
  feedIdList: string[]
  onRefresh: () => void
}) {
  const { theme } = useStyles()
  const headerHeight = useHeaderHeight()

  const { data: latestData } = useQuerySubscription(
    db.query.entries.findFirst({
      where(fields, { inArray }) {
        return inArray(fields.feedId, feedIdList ?? [])
      },
      orderBy(fields, { desc }) {
        return [desc(fields.insertedAt)]
      },
    }),
    ['latestData', { feedIdList }],
  )

  const { data: hasNew } = useSWR(
    feedIdList?.length > 0
      ? ['check-new', feedIdList, latestData?.insertedAt]
      : null,
    async () => {
      const { data } = await (
        // @ts-expect-error
        apiClient.entries['check-new'].$get({
          query: {
            ...(feedIdList.length > 1 ? { feedIdList } : { feedId: feedIdList[0] }),
            insertedAfter: Date.parse(latestData?.insertedAt ?? (new Date()).toISOString()),
          },
        }) as Promise<{ data: { has_new: boolean, lastest_at?: string } }>
      )
      return data.has_new ?? false
    },
  )

  if (!hasNew)
    return null

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        position: 'absolute',
        top: headerHeight,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        pointerEvents: 'box-none',
        zIndex: 999,
      }}
    >
      <Pressable
        onPress={() => { onRefresh() }}
      >
        <Row
          bg={theme.colors.accent9}
          style={{ borderRadius: 9999 }}
          mt={20}
          p={10}
          gap={6}
          align="center"
        >
          <Iconify
            icon="mingcute:arrow-up-fill"
            size={14}
            color={theme.colors.accentContrast}
          />
          <Text size={12} weight="600" color="accentContrast">
            Refresh to see new entries
          </Text>
        </Row>
      </Pressable>
    </Animated.View>
  )
}
