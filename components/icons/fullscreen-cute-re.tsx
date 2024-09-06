import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgFullscreenCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M3.5 8v-.5a4 4 0 0 1 4-4H8M3.5 16v.5a4 4 0 0 0 4 4H8M20.5 8v-.5a4 4 0 0 0-4-4H16M20.5 16v.5a4 4 0 0 1-4 4H16" /></Svg>
}
const ForwardRef = forwardRef(SvgFullscreenCuteRe)
const Memo = memo(ForwardRef)
export default Memo
