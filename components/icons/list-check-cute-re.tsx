import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgListCheckCuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path fill="#10161F" d="M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 19a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" /><Path stroke="#10161F" strokeLinecap="round" strokeWidth={2} d="M9 5h11M9 12h11M9 19h11M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" /></Svg>
}
const Memo = memo(SvgListCheckCuteRe)
export default Memo
