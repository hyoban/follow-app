import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgCheckCircleFilled(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m4.95 7.795a1 1 0 0 0-1.415-1.414l-4.95 4.95-2.12-2.121a1 1 0 0 0-1.415 1.414l2.829 2.828a1 1 0 0 0 1.414 0z" clipRule="evenodd" /></Svg>
}
const Memo = memo(SvgCheckCircleFilled)
export default Memo
