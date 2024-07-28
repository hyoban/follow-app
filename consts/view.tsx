import { Iconify } from '~/components'

export const views = [
  {
    name: 'index',
    title: 'Articles',
    icon: (color: string) => <Iconify icon="mingcute:paper-fill" color={color} />,
    color: 'orange',
  },
  {
    name: 'social',
    title: 'Social Media',
    icon: (color: string) => <Iconify icon="mingcute:twitter-fill" color={color} />,
    color: 'sky',
  },
  {
    name: 'picture',
    title: 'Pictures',
    icon: (color: string) => <Iconify icon="mingcute:pic-fill" color={color} />,
    color: 'green',
  },
  {
    name: 'video',
    title: 'Videos',
    icon: (color: string) => <Iconify icon="mingcute:video-fill" color={color} />,
    color: 'red',
  },
  {
    name: 'audio',
    title: 'Audios',
    icon: (color: string) => <Iconify icon="mingcute:mic-fill" color={color} />,
    color: 'purple',
  },
  {
    name: 'notification',
    title: 'Notifications',
    icon: (color: string) => <Iconify icon="mingcute:announcement-fill" color={color} />,
    color: 'yellow',
  },
]
