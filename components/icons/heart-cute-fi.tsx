import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgHeartCuteFi(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M4.871 4.224c1.763-1.329 4.14-1.715 6.305-.456.326.19.551.32.714.408.102.055.118.055.22 0 .163-.088.388-.218.714-.408 2.164-1.26 4.542-.873 6.305.456 1.75 1.32 2.927 3.576 2.869 6.17-.081 3.609-2.89 6.793-7.679 9.637a4.549 4.549 0 0 1-4.638 0c-4.788-2.844-7.598-6.028-7.679-9.637-.058-2.594 1.12-4.85 2.87-6.17" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgHeartCuteFi)
const Memo = memo(ForwardRef)
export default Memo
