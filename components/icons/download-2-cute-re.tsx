import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgDownload2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m-4.242-3.586c.83 1.915 2.023 3.18 3.848 4.062.249.12.54.12.789 0 1.824-.882 3.017-2.147 3.848-4.062M4.002 16c.012 2.175.109 3.353.877 4.121C5.758 21 7.172 21 10 21h4c2.829 0 4.243 0 5.122-.879.768-.768.864-1.946.877-4.121" /></Svg>
}
const ForwardRef = forwardRef(SvgDownload2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
