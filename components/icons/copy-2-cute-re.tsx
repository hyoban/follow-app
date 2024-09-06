import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgCopy2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeWidth={2} d="M7.824 5c.09-.266.204-.504.35-.722a4 4 0 0 1 1.104-1.104C10.286 2.5 11.69 2.5 14.5 2.5c2.809 0 4.213 0 5.222.674.437.292.812.667 1.104 1.104.674 1.009.674 2.413.674 5.222 0 2.809 0 4.213-.674 5.222a4.003 4.003 0 0 1-1.104 1.104c-.219.146-.456.26-.722.35M9.5 21.5c2.809 0 4.213 0 5.222-.674a4.003 4.003 0 0 0 1.104-1.104c.674-1.009.674-2.413.674-5.222 0-2.809 0-4.213-.674-5.222a4.002 4.002 0 0 0-1.104-1.104C13.713 7.5 12.31 7.5 9.5 7.5c-2.809 0-4.213 0-5.222.674a4 4 0 0 0-1.104 1.104C2.5 10.287 2.5 11.69 2.5 14.5c0 2.809 0 4.213.674 5.222.292.437.667.812 1.104 1.104 1.009.674 2.413.674 5.222.674Z" /></Svg>
}
const ForwardRef = forwardRef(SvgCopy2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
