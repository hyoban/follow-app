import { useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'
import Markdown from 'react-native-markdown-display'
import Modal from 'react-native-modal'
import { TabBar, TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import useSWR from 'swr'

import { apiClient } from '~/api/client'
import type { TabViewIndex } from '~/store/layout'

import { IconButton } from './button'
import { Column } from './flex'
import { IconMagic2CuteRe } from './icons'
import { Text } from './text'

enum DayOf {
  Today,
  Yesterday,
}

function useParseDailyDate(day: DayOf) {
  return useMemo(() => {
    const dateObj = new Date()

    const nowHour = dateObj.getHours()
    let startDate: number
    let endDate: number
    let title: string

    const today8AM = dateObj.setHours(8, 0, 0, 0)
    const today8PM = dateObj.setHours(20, 0, 0, 0)
    dateObj.setDate(dateObj.getDate() - 1)
    const yesterday8AM = dateObj.setHours(8, 0, 0, 0)
    const yesterday8PM = dateObj.setHours(20, 0, 0, 0)
    dateObj.setDate(dateObj.getDate() - 1)
    const dayBeforeYesterday8PM = dateObj.setHours(20, 0, 0, 0)

    const isToday = day === DayOf.Today
    // For index 0, get the last past 8 AM or 8 PM; for index 1, get the second last past 8 AM or 8 PM.
    if (nowHour >= 20) {
      if (isToday) {
        endDate = today8PM - 1
        startDate = today8AM
        title = 'Today'
      }
      else {
        endDate = today8AM - 1
        startDate = yesterday8PM
        title = 'Last Night'
      }
    }
    else if (nowHour >= 8) {
      if (isToday) {
        endDate = today8AM - 1
        startDate = yesterday8PM
        title = 'Last Night'
      }
      else {
        endDate = yesterday8PM - 1
        startDate = yesterday8AM
        title = 'Yesterday'
      }
    }
    else {
      if (isToday) {
        endDate = yesterday8PM - 1
        startDate = yesterday8AM
        title = 'Yesterday'
      }
      else {
        endDate = yesterday8AM - 1
        startDate = dayBeforeYesterday8PM
        title = 'The Night Before Last'
      }
    }

    return { title, startDate, endDate }
  }, [day])
}

function AIDailyContent({ view, date }: { view: TabViewIndex, date: DayOf }) {
  const { styles } = useStyles(styleSheet)
  const { startDate } = useParseDailyDate(date)
  const { data } = useSWR(
    ['ai-daily', view, startDate],
    async ([_key, view, startDate]) => {
      const res = await apiClient.ai.daily.$get({ query: { view: `${view}`, startDate: `${startDate}` } })
      const json = await res.json()
      return json.data
    },
  )
  return (
    <ScrollView
      style={styles.content}
    >
      <Markdown>{data ?? ''}</Markdown>
    </ScrollView>
  )
}

export function AIDaily({ view }: { view: TabViewIndex }) {
  const { styles, theme } = useStyles(styleSheet)

  const { title: yesterdayTitle } = useParseDailyDate(DayOf.Yesterday)
  const { title: todayTitle } = useParseDailyDate(DayOf.Today)
  const [modalVisible, setModalVisible] = useState(false)

  const [index, setIndex] = useState(0)
  const routes = useMemo(() => [
    { key: 'yesterday', title: yesterdayTitle },
    { key: 'today', title: todayTitle },
  ], [todayTitle, yesterdayTitle])

  return (
    <>
      <Modal isVisible={modalVisible}>
        <View style={styles.container}>
          <Column style={styles.modal}>
            <TabView
              navigationState={{ index, routes }}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  style={{ backgroundColor: theme.colors.gray2 }}
                  indicatorStyle={{ backgroundColor: theme.colors.accent9 }}
                  renderLabel={props => (
                    <Text
                      color={props.focused ? theme.colors.accent9 : theme.colors.gray12}
                      size={16}
                      weight={600}
                    >
                      {props.route.title}
                    </Text>
                  )}
                />
              )}
              renderScene={({ route }) => {
                switch (route.key) {
                  case 'yesterday': {
                    return <AIDailyContent view={view} date={DayOf.Yesterday} />
                  }
                  case 'today': {
                    return <AIDailyContent view={view} date={DayOf.Today} />
                  }
                  default: {
                    return null
                  }
                }
              }}
              onIndexChange={index => setIndex(index)}
            />
          </Column>
        </View>
      </Modal>
      <IconButton
        onPress={() => {
          setModalVisible(true)
        }}
      >
        <IconMagic2CuteRe />
      </IconButton>
    </>
  )
}

const styleSheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: theme.colors.gray2,
    width: '90%',
    minHeight: 400,
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomColor: theme.colors.gray3,
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
}))
