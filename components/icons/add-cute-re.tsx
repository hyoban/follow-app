import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgAddCuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 12h14m-7 7V5" /></Svg>
}
const Memo = memo(SvgAddCuteRe)
export default Memo
