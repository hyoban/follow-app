import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgPauseCuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M8 5v14m8-14v14" /></Svg>
}
const Memo = memo(SvgPauseCuteRe)
export default Memo
