import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgExitCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M12.5 12H20m-2.5-2.828a8.616 8.616 0 0 1 2.478 2.307.89.89 0 0 1 0 1.042A8.631 8.631 0 0 1 17.5 14.83M12.5 3.5c-3.44.002-5.21.053-6.328 1.171C5 5.843 5 7.73 5 11.5v1c0 3.771 0 5.657 1.172 6.828C7.29 20.447 9.06 20.498 12.5 20.5" /></Svg>
}
const ForwardRef = forwardRef(SvgExitCuteRe)
const Memo = memo(ForwardRef)
export default Memo
