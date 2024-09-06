import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgGiftCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinejoin="round" strokeWidth={2} d="M12 20V7m0 0V6m0 1h-1a3 3 0 0 1-3-3c0-.471 0-.707.146-.854C8.293 3 8.53 3 9 3a3 3 0 0 1 3 3m0 1h1a3 3 0 0 0 3-3c0-.471 0-.707-.146-.854C15.707 3 15.47 3 15 3a3 3 0 0 0-3 3m-7 6h14v1c0 2.809 0 4.213-.674 5.222a4.003 4.003 0 0 1-1.104 1.104C16.213 20 14.81 20 12 20c-2.809 0-4.213 0-5.222-.674a4.002 4.002 0 0 1-1.104-1.104C5 17.213 5 15.81 5 13zm.667 0h12.666c.623 0 .935 0 1.167-.134a1 1 0 0 0 .366-.366c.134-.232.134-.544.134-1.167 0-1.246 0-1.869-.268-2.333A2 2 0 0 0 19 7.268C18.536 7 17.913 7 16.667 7H7.333C6.087 7 5.464 7 5 7.268A2 2 0 0 0 4.268 8C4 8.464 4 9.087 4 10.333c0 .623 0 .935.134 1.167a1 1 0 0 0 .366.366c.232.134.544.134 1.167.134Z" /></Svg>
}
const ForwardRef = forwardRef(SvgGiftCuteRe)
const Memo = memo(ForwardRef)
export default Memo
