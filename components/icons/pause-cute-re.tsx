import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgPauseCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M8 5v14m8-14v14" /></Svg>
}
const ForwardRef = forwardRef(SvgPauseCuteRe)
const Memo = memo(ForwardRef)
export default Memo
