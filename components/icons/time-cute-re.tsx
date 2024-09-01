import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgTimeCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v3.757a3 3 0 0 0 .879 2.122L15 15m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0" /></Svg>
}
const ForwardRef = forwardRef(SvgTimeCuteRe)
const Memo = memo(ForwardRef)
export default Memo
