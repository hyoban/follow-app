import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgBugCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 13H3m18 0h-3M7 9C6 9 4.5 8 4 7m3 11c-1.5 0-2 2-2 3m12-3c1.5 0 2 2 2 3M17 9c1 0 2.5-1 3-2m-8 13.88v-8m-6 .62c0-1.688.446-3.246 1.2-4.5h9.6c.754 1.254 1.2 2.812 1.2 4.5 0 4.142-2.686 7.5-6 7.5s-6-3.358-6-7.5M8.535 6h6.93A3.998 3.998 0 0 0 12 4c-1.48 0-2.773.804-3.465 2" /></Svg>
}
const ForwardRef = forwardRef(SvgBugCuteRe)
const Memo = memo(ForwardRef)
export default Memo
