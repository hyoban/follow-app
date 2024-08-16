import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle } from 'react-native-svg'

function SvgRoundCuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} /></Svg>
}
const Memo = memo(SvgRoundCuteRe)
export default Memo
