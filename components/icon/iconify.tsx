// credit: https://github.com/oktaysenkan/react-native-iconify

import type { FullExtendedIconifyIcon } from '@iconify/utils'
import type { XmlProps } from 'react-native-svg'

import { renderIcon } from './icon'

type Props = {
  icon: string
  size?: number
} & Omit<XmlProps, 'xml'>

export type RuntimeProps = Props & {
  isPluginInstalled: boolean
  iconData: FullExtendedIconifyIcon
}

export function Iconify(props: Props) {
  const runtimeProps = props as RuntimeProps
  const { isPluginInstalled } = runtimeProps

  if (!isPluginInstalled) {
    throw new Error(
      'Iconify: You need to install a Babel plugin before using this library. You can continue by adding the following to your babel.config.js',
    )
  }

  return renderIcon(runtimeProps)
}

export default Iconify
