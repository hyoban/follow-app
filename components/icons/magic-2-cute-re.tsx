import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgMagic2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6.05 6.05 1.413 1.413M12.006 12l8.186 8.192M15.95 6.05l-1.411 1.412m-7.072 7.07L6.05 15.95M18 11h-2.05m-9.9 0H4m7 7v-2.05m0-9.9V4" /></Svg>
}
const ForwardRef = forwardRef(SvgMagic2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
