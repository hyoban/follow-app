import type { Routes } from 'expo-router'

import { Iconify } from '~/components'
import type { TabViewIndex } from '~/store/layout'

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
    icon: (color: string) => <Iconify icon="mgc:paper-cute-fi" color={color} />,
    color: 'orange',
  },
  {
    view: 1,
    name: 'social',
    path: '/social',
    title: 'Social Media',
    icon: (color: string) => <Iconify icon="mgc:twitter-cute-fi" color={color} />,
    color: 'sky',
  },
  {
    view: 2,
    name: 'picture',
    path: '/picture',
    title: 'Pictures',
    icon: (color: string) => <Iconify icon="mgc:pic-cute-fi" color={color} />,
    color: 'green',
  },
  {
    view: 3,
    name: 'video',
    path: '/video',
    title: 'Videos',
    icon: (color: string) => <Iconify icon="mgc:video-cute-fi" color={color} />,
    color: 'red',
  },
  {
    view: 4,
    name: 'audio',
    path: '/audio',
    title: 'Audios',
    icon: (color: string) => <Iconify icon="mgc:mic-cute-fi" color={color} />,
    color: 'purple',
  },
  {
    view: 5,
    name: 'notification',
    path: '/notification',
    title: 'Notifications',
    icon: (color: string) => <Iconify icon="mgc:announcement-cute-fi" color={color} />,
    color: 'yellow',
  },
]
