import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgEye2CuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path stroke="#10161F" strokeWidth={2} d="M21 12c0 3-4.03 6.5-9 6.5S3 15 3 12s4.03-6.5 9-6.5S21 9 21 12Z" /><Path stroke="#10161F" strokeWidth={2} d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" /></Svg>
}
const Memo = memo(SvgEye2CuteRe)
export default Memo
