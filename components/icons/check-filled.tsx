import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgCheckFilled(props: SvgProps) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill={props.color || theme.colors.gray12} fillRule="evenodd" d="M21.546 5.112a1.5 1.5 0 0 1 0 2.121L10.232 18.547a1.5 1.5 0 0 1-2.121 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.112a1.5 1.5 0 0 1 2.122 0" clipRule="evenodd" /></Svg>
}
const Memo = memo(SvgCheckFilled)
export default Memo
