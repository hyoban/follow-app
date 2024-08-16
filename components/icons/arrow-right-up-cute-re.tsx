import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgArrowRightUpCuteRe(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path stroke={props.color || theme.colors.gray12} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.946 7.054 6.339 17.661M9.409 6.59a15.963 15.963 0 0 1 6.796-.249c.571.1.857.149 1.08.373.225.224.274.51.374 1.08a15.963 15.963 0 0 1-.25 6.796" /></Svg>
}
const Memo = memo(SvgArrowRightUpCuteRe)
export default Memo
