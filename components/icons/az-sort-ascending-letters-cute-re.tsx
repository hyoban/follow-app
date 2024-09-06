import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgAzSortAscendingLettersCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.714 9h4.572M5 11a35.518 35.518 0 0 1 2.365-6.715.496.496 0 0 1 .45-.285h.37c.192 0 .368.11.45.285A35.52 35.52 0 0 1 11 11m-6 3h5.5a.5.5 0 0 1 .3.9l-5.6 4.2a.5.5 0 0 0 .3.9H11m6-15v14m2.828-2c-.691 1.251-1.577 2.137-2.828 2.828-1.251-.691-2.137-1.577-2.828-2.828" /></Svg>
}
const ForwardRef = forwardRef(SvgAzSortAscendingLettersCuteRe)
const Memo = memo(ForwardRef)
export default Memo
