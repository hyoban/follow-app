import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgDelete2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="m4.5 5.5.595 9.513c.16 2.576.241 3.864.89 4.788a4 4 0 0 0 1.18 1.108c.963.591 2.254.591 4.835.591v0c2.581 0 3.872 0 4.834-.59a4 4 0 0 0 1.18-1.11c.65-.923.73-2.211.892-4.787L19.5 5.5m-12 0 .088-.265c.44-1.32.66-1.98 1.184-2.357.524-.378 1.22-.378 2.611-.378h1.234c1.391 0 2.087 0 2.61.378.525.377.745 1.037 1.185 2.357l.088.265M10 11v5m4-5v5M3.5 5.5h17" /></Svg>
}
const ForwardRef = forwardRef(SvgDelete2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
