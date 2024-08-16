import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgListCheckCuteRe(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill={props.color || theme.colors.gray12} d="M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 19a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" /><Path stroke={props.color || theme.colors.gray12} strokeLinecap="round" strokeWidth={2} d="M9 5h11M9 12h11M9 19h11M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" /></Svg>
}
const Memo = memo(SvgListCheckCuteRe)
export default Memo
