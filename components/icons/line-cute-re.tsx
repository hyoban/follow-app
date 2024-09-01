import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgLineCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M4 20 20 4" /></Svg>
}
const ForwardRef = forwardRef(SvgLineCuteRe)
const Memo = memo(ForwardRef)
export default Memo