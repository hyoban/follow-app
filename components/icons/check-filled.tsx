import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgCheckFilled(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" fillRule="evenodd" d="M21.546 5.112a1.5 1.5 0 0 1 0 2.121L10.232 18.547a1.5 1.5 0 0 1-2.121 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.112a1.5 1.5 0 0 1 2.122 0" clipRule="evenodd" /></Svg>
}
const Memo = memo(SvgCheckFilled)
export default Memo
