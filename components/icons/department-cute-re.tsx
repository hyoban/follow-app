import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgDepartmentCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Path stroke="currentColor" strokeLinejoin="round" strokeWidth={2} d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v4m-6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></Svg>
}
const ForwardRef = forwardRef(SvgDepartmentCuteRe)
const Memo = memo(ForwardRef)
export default Memo
