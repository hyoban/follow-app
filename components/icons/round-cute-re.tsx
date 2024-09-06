import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgRoundCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} /></Svg>
}
const ForwardRef = forwardRef(SvgRoundCuteRe)
const Memo = memo(ForwardRef)
export default Memo
