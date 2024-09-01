import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgGoogleCuteFi(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17.641 6.328a8 8 0 1 0 2.297 6.67C20.007 12.45 19.552 12 19 12h-6" /></Svg>
}
const ForwardRef = forwardRef(SvgGoogleCuteFi)
const Memo = memo(ForwardRef)
export default Memo
