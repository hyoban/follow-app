import type { Route } from 'expo-router'

import {
  IconAnnouncementCuteFi,
  IconMicCuteFi,
  IconPaperCuteFi,
  IconPicCuteFi,
  IconTwitterCuteFi,
  IconVideoCuteFi,
} from '~/components/icons'
import type { TabViewIndex } from '~/store/layout'

export type TabView = {
  view: TabViewIndex
  name: string
  path: Route
  title: string
  icon: (color: string) => React.ReactNode
  iconRequire: () => any
  color: string
}

export const tabViewList: TabView[] = [
  {
    view: 0,
    name: 'index',
    path: '/',
    title: 'Articles',
    icon: (color: string) => <IconPaperCuteFi color={color} />,
    iconRequire: () => require('~/icons/mgc/paper_cute_fi.svg'),
    color: 'orange',
  },
  {
    view: 1,
    name: 'social',
    path: '/social',
    title: 'Social Media',
    icon: (color: string) => <IconTwitterCuteFi color={color} />,
    iconRequire: () => require('~/icons/mgc/twitter_cute_fi.svg'),
    color: 'sky',
  },
  {
    view: 2,
    name: 'picture',
    path: '/picture',
    title: 'Pictures',
    icon: (color: string) => <IconPicCuteFi color={color} />,
    iconRequire: () => require('~/icons/mgc/pic_cute_fi.svg'),
    color: 'green',
  },
  {
    view: 3,
    name: 'video',
    path: '/video',
    title: 'Videos',
    icon: (color: string) => <IconVideoCuteFi color={color} />,
    iconRequire: () => require('~/icons/mgc/video_cute_fi.svg'),
    color: 'red',
  },
  {
    view: 4,
    name: 'audio',
    path: '/audio',
    title: 'Audios',
    icon: (color: string) => <IconMicCuteFi color={color} />,
    iconRequire: () => require('~/icons/mgc/mic_cute_fi.svg'),
    color: 'purple',
  },
  {
    view: 5,
    name: 'notification',
    path: '/notification',
    title: 'Notifications',
    icon: (color: string) => <IconAnnouncementCuteFi color={color} />,
    iconRequire: () => require('~/icons/mgc/announcement_cute_fi.svg'),
    color: 'yellow',
  },
]
