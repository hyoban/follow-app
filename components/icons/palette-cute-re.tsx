import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgPaletteCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path fill="currentColor" d="M8 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M10 8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M15 8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" /><Path stroke="currentColor" strokeWidth={2} d="M17.902 15.484c1.322.22 2.682-.458 2.936-1.773a9 9 0 1 0-8.469 7.282c1.292-.053 1.891-1.472 1.313-2.63a2.115 2.115 0 0 1 .396-2.44l.089-.09a2.29 2.29 0 0 1 1.995-.64z" /><Path stroke="currentColor" strokeWidth={2} d="M8 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM10 8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM15 8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" /></Svg>
}
const ForwardRef = forwardRef(SvgPaletteCuteRe)
const Memo = memo(ForwardRef)
export default Memo