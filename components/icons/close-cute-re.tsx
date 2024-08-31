import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgCloseCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Path fill="currentColor" d="M6.343 4.93a1 1 0 0 0-1.414 1.414zm11.314 14.142a1 1 0 1 0 1.414-1.415zM4.929 17.658a1 1 0 0 0 1.414 1.414zM19.07 6.344a1 1 0 0 0-1.414-1.414zm-14.142 0 12.728 12.728 1.414-1.415L6.343 4.93zm1.414 12.728L19.07 6.344 17.657 4.93 4.929 17.658z" /></Svg>
}
const ForwardRef = forwardRef(SvgCloseCuteRe)
const Memo = memo(ForwardRef)
export default Memo
