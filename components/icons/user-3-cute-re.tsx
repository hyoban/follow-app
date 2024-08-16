import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgUser3CuteRe(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path stroke={props.color || theme.colors.gray12} strokeWidth={2} d="M20 18.5c0 1.933-3.582 2.5-8 2.5s-8-.567-8-2.5S7.582 14 12 14s8 2.567 8 4.5ZM16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /></Svg>
}
const Memo = memo(SvgUser3CuteRe)
export default Memo
