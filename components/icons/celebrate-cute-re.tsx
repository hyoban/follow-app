import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgCelebrateCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.182 9.818 1.06-1.06m-3.535-.708s1.414-2.828.707-4.95m3.182 9.546s2.475-.353 4.243.707m-2.475-6.717.707-.707m.354 3.889h.707M9.236 19.844l1.394-.477c2.723-.932 4.085-1.398 4.336-2.48.25-1.08-.767-2.098-2.802-4.133l-.918-.918C9.211 9.801 8.193 8.783 7.112 9.034c-1.081.25-1.547 1.612-2.479 4.336l-.477 1.394c-1.15 3.36-1.724 5.04-.842 5.922.881.882 2.561.307 5.922-.842" /></Svg>
}
const ForwardRef = forwardRef(SvgCelebrateCuteRe)
const Memo = memo(ForwardRef)
export default Memo
