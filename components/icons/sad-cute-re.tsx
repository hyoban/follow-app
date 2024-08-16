import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgSadCuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path fill="currentColor" d="M9 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M16 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" /><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M9.354 15c.705-.622 1.632-1 2.646-1 1.015 0 1.94.378 2.646 1M9 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm5 2.5c0 8-6 9-9 9s-9-1-9-9c0-6 4.03-9 9-9s9 3 9 9Z" /></Svg>
}
const Memo = memo(SvgSadCuteRe)
export default Memo
