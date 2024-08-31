import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgPauseCuteFi(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Path fill="currentColor" d="M14 5a2 2 0 1 1 4 0v14a2 2 0 1 1-4 0zM6 5a2 2 0 1 1 4 0v14a2 2 0 1 1-4 0z" /></Svg>
}
const ForwardRef = forwardRef(SvgPauseCuteFi)
const Memo = memo(ForwardRef)
export default Memo
