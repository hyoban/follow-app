import { Iconify } from '~/components'

export const views = [
  {
    view: 0,
    name: 'index',
    title: 'Articles',
    icon: (color: string) => <Iconify icon="mingcute:paper-fill" color={color} />,
    color: 'orange',
  },
  {
    view: 1,
    name: 'social',
    title: 'Social Media',
    icon: (color: string) => <Iconify icon="mingcute:twitter-fill" color={color} />,
    color: 'sky',
  },
  {
    view: 2,
    name: 'picture',
    title: 'Pictures',
    icon: (color: string) => <Iconify icon="mingcute:pic-fill" color={color} />,
    color: 'green',
  },
  {
    view: 3,
    name: 'video',
    title: 'Videos',
    icon: (color: string) => <Iconify icon="mingcute:video-fill" color={color} />,
    color: 'red',
  },
  {
    view: 4,
    name: 'audio',
    title: 'Audios',
    icon: (color: string) => <Iconify icon="mingcute:mic-fill" color={color} />,
    color: 'purple',
  },
  {
    view: 5,
    name: 'notification',
    title: 'Notifications',
    icon: (color: string) => <Iconify icon="mingcute:announcement-fill" color={color} />,
    color: 'yellow',
  },
]
