import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgPauseCuteFi(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path fill="currentColor" d="M14 5a2 2 0 1 1 4 0v14a2 2 0 1 1-4 0zM6 5a2 2 0 1 1 4 0v14a2 2 0 1 1-4 0z" /></Svg>
}
const Memo = memo(SvgPauseCuteFi)
export default Memo
