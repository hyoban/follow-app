import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgSortAscendingCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M4 12h9m-9 7h9M4 5h7m7 14V5m2.828 2c-.646-1.17-1.462-2.02-2.588-2.69a.468.468 0 0 0-.48 0c-1.126.67-1.942 1.52-2.588 2.69" /></Svg>
}
const ForwardRef = forwardRef(SvgSortAscendingCuteRe)
const Memo = memo(ForwardRef)
export default Memo
