import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle, Path } from 'react-native-svg'

function SvgRoundCuteFi(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Circle cx={12} cy={12} r={10} fill="currentColor" /></Svg>
}
const Memo = memo(SvgRoundCuteFi)
export default Memo
