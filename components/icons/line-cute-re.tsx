import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgLineCuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M4 20 20 4" /></Svg>
}
const Memo = memo(SvgLineCuteRe)
export default Memo
