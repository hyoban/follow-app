import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgListCheckCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path fill="currentColor" d="M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 19a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" /><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M9 5h11M9 12h11M9 19h11M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" /></Svg>
}
const ForwardRef = forwardRef(SvgListCheckCuteRe)
const Memo = memo(ForwardRef)
export default Memo
