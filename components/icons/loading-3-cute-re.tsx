import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle, Path } from 'react-native-svg'

function SvgLoading3CuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Circle cx={12} cy={12} r={9} stroke="#10161F" strokeWidth={2} opacity={0.1} /><Path stroke="#10161F" strokeLinecap="round" strokeWidth={2} d="M12 3a8.958 8.958 0 0 0-6.225 2.5" /></Svg>
}
const Memo = memo(SvgLoading3CuteRe)
export default Memo
