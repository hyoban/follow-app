import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgMicCuteFi(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" fillRule="evenodd" d="M7 7a5 5 0 0 1 10 0v5a5 5 0 0 1-10 0zm6 12.938V21a1 1 0 1 1-2 0v-1.062a8.005 8.005 0 0 1-6.919-6.796 1 1 0 0 1 1.98-.284 6.001 6.001 0 0 0 11.878 0 1 1 0 0 1 1.98.284A8.004 8.004 0 0 1 13 19.938" clipRule="evenodd" /></Svg>
}
const Memo = memo(SvgMicCuteFi)
export default Memo
