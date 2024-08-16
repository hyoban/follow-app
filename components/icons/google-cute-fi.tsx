import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgGoogleCuteFi(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17.641 6.328a8 8 0 1 0 2.297 6.67C20.007 12.45 19.552 12 19 12h-6" /></Svg>
}
const Memo = memo(SvgGoogleCuteFi)
export default Memo
