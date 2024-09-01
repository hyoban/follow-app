import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgRightCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.343 17.657a15.965 15.965 0 0 0 4.981-4.63c.334-.473.5-.71.5-1.027 0-.317-.166-.554-.5-1.028a15.962 15.962 0 0 0-4.98-4.629" /></Svg>
}
const ForwardRef = forwardRef(SvgRightCuteRe)
const Memo = memo(ForwardRef)
export default Memo
