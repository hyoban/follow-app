import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgInformationCuteReCopy(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" d="M12 7a1 1 0 1 0 0 2zm.002 2a1 1 0 0 0 0-2zM11 10a1 1 0 1 0 0 2zm1.5 8a1 1 0 1 0 0-2zm7.5-6a8 8 0 0 1-8 8v2c5.523 0 10-4.477 10-10zm-8 8a8 8 0 0 1-8-8H2c0 5.523 4.477 10 10 10zm-8-8a8 8 0 0 1 8-8V2C6.477 2 2 6.477 2 12zm8-8a8 8 0 0 1 8 8h2c0-5.523-4.477-10-10-10zm0 5h.002V7H12zm-1 2.5v5h2v-5zm.5-1.5H11v2h.5zm-.5 6.5a1.5 1.5 0 0 0 1.5 1.5v-2a.5.5 0 0 1 .5.5zm2-5a1.5 1.5 0 0 0-1.5-1.5v2a.5.5 0 0 1-.5-.5z" /></Svg>
}
const ForwardRef = forwardRef(SvgInformationCuteReCopy)
const Memo = memo(ForwardRef)
export default Memo
