import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgGoogleCuteFi(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path stroke={props.color || theme.colors.gray12} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17.641 6.328a8 8 0 1 0 2.297 6.67C20.007 12.45 19.552 12 19 12h-6" /></Svg>
}
const Memo = memo(SvgGoogleCuteFi)
export default Memo
