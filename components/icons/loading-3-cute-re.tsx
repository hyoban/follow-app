import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle, Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgLoading3CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} opacity={0.1} /><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M12 3a8.958 8.958 0 0 0-6.225 2.5" /></Svg>
}
const ForwardRef = forwardRef(SvgLoading3CuteRe)
const Memo = memo(ForwardRef)
export default Memo
