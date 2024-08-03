import type { Routes } from 'expo-router'

import type { TabViewIndex } from '~/atom/layout'
import { Iconify } from '~/components'

export type TabView = {
  view: TabViewIndex
  name: string
  path: Routes
  title: string
  icon: (color: string) => React.ReactNode
  color: string
}

export const tabViewList: TabView[] = [
  {
    view: 0,
    name: 'index',
    path: '/',
    title: 'Articles',
    icon: (color: string) => <Iconify icon="mingcute:paper-fill" color={color} />,
    color: 'orange',
  },
  {
    view: 1,
    name: 'social',
    path: '/social',
    title: 'Social Media',
    icon: (color: string) => <Iconify icon="mingcute:twitter-fill" color={color} />,
    color: 'sky',
  },
  {
    view: 2,
    name: 'picture',
    path: '/picture',
    title: 'Pictures',
    icon: (color: string) => <Iconify icon="mingcute:pic-fill" color={color} />,
    color: 'green',
  },
  {
    view: 3,
    name: 'video',
    path: '/video',
    title: 'Videos',
    icon: (color: string) => <Iconify icon="mingcute:video-fill" color={color} />,
    color: 'red',
  },
  {
    view: 4,
    name: 'audio',
    path: '/audio',
    title: 'Audios',
    icon: (color: string) => <Iconify icon="mingcute:mic-fill" color={color} />,
    color: 'purple',
  },
  {
    view: 5,
    name: 'notification',
    path: '/notification',
    title: 'Notifications',
    icon: (color: string) => <Iconify icon="mingcute:announcement-fill" color={color} />,
    color: 'yellow',
  },
]
