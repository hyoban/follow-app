import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle } from 'react-native-svg'

function SvgRoundCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} /></Svg>
}
const ForwardRef = forwardRef(SvgRoundCuteRe)
const Memo = memo(ForwardRef)
export default Memo
