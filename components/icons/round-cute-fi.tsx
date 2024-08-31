import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle } from 'react-native-svg'

function SvgRoundCuteFi(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Circle cx={12} cy={12} r={10} fill="currentColor" /></Svg>
}
const ForwardRef = forwardRef(SvgRoundCuteFi)
const Memo = memo(ForwardRef)
export default Memo
