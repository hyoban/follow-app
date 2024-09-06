import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgSadCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" d="M9 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M16 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" /><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M9.354 15c.705-.622 1.632-1 2.646-1 1.015 0 1.94.378 2.646 1M9 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm5 2.5c0 8-6 9-9 9s-9-1-9-9c0-6 4.03-9 9-9s9 3 9 9Z" /></Svg>
}
const ForwardRef = forwardRef(SvgSadCuteRe)
const Memo = memo(ForwardRef)
export default Memo
