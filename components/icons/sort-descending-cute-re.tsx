import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgSortDescendingCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M18 5v14m-2.828-2c.646 1.17 1.462 2.02 2.588 2.69a.468.468 0 0 0 .48 0c1.126-.67 1.942-1.52 2.588-2.69M4 12h9M4 5h9M4 19h7" /></Svg>
}
const ForwardRef = forwardRef(SvgSortDescendingCuteRe)
const Memo = memo(ForwardRef)
export default Memo
