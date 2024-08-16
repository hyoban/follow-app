import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle, Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgLoading3CuteRe(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Circle cx={12} cy={12} r={9} stroke={props.color || theme.colors.gray12} strokeWidth={2} opacity={0.1} /><Path stroke={props.color || theme.colors.gray12} strokeLinecap="round" strokeWidth={2} d="M12 3a8.958 8.958 0 0 0-6.225 2.5" /></Svg>
}
const Memo = memo(SvgLoading3CuteRe)
export default Memo
