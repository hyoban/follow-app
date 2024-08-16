import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgSearch2CuteRe(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path stroke={props.color || theme.colors.gray12} strokeLinecap="round" strokeWidth={2} d="M14.5 14.5 20 20m-4-10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></Svg>
}
const Memo = memo(SvgSearch2CuteRe)
export default Memo
