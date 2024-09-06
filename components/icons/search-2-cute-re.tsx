import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgSearch2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M14.5 14.5 20 20m-4-10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></Svg>
}
const ForwardRef = forwardRef(SvgSearch2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
