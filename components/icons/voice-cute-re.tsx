import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgVoiceCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M4 10v4m4-7v10m4-13v16m4-13v10m4-7v4" /></Svg>
}
const ForwardRef = forwardRef(SvgVoiceCuteRe)
const Memo = memo(ForwardRef)
export default Memo
