import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgEye2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeWidth={2} d="M21 12c0 3-4.03 6.5-9 6.5S3 15 3 12s4.03-6.5 9-6.5S21 9 21 12Z" /><Path stroke="currentColor" strokeWidth={2} d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" /></Svg>
}
const ForwardRef = forwardRef(SvgEye2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
