import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgFlag1CuteFi(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path fill="#10161F" fillRule="evenodd" d="M20.355 3.82c.442.868-.213 1.685-.701 2.356l-1.99 2.736c-.423.582-.424.593 0 1.176l1.99 2.736c.488.672 1.143 1.488.7 2.357-.442.87-1.484.82-2.318.82H6v5a1 1 0 0 1-2 0V9.928c0-1.354 0-2.47.119-3.354.125-.928.396-1.747 1.053-2.403.656-.656 1.475-.928 2.403-1.053C8.459 3 9.575 3 10.929 3h7.107c.834 0 1.876-.05 2.319.82" clipRule="evenodd" /></Svg>
}
const Memo = memo(SvgFlag1CuteFi)
export default Memo
