import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Circle } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgRoundCuteFi(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Circle cx={12} cy={12} r={10} fill={props.color || theme.colors.gray12} /></Svg>
}
const Memo = memo(SvgRoundCuteFi)
export default Memo
