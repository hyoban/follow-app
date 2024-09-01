import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgFullscreenExitCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M8 3.5V4a4 4 0 0 1-4 4h-.5m17 0H20a4 4 0 0 1-4-4v-.5m0 17V20a4 4 0 0 1 4-4h.5m-17 0H4a4 4 0 0 1 4 4v.5" /></Svg>
}
const ForwardRef = forwardRef(SvgFullscreenExitCuteRe)
const Memo = memo(ForwardRef)
export default Memo
