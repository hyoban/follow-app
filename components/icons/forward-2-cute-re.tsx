import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgForward2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" d="M13.296 12.858a1 1 0 0 1 .86-1.806zm6.385-5.676a1 1 0 0 1 1.991-.189zM11.501 7v1zM4 15.5a1 1 0 1 1-2 0zm15.356-2.48.073.998zm-5.202-1.968c1.688.802 3.296 1.106 5.129.971l.146 1.995c-2.184.16-4.137-.211-6.134-1.16zm4.692 1.277c.752-1.674 1.01-3.284.834-5.147l1.991-.189c.209 2.198-.103 4.157-1 6.156zM11.5 8A7.5 7.5 0 0 0 4 15.5H2A9.5 9.5 0 0 1 11.5 6zm7.17 5.294A7.504 7.504 0 0 0 11.5 8V6c4.276 0 7.89 2.824 9.083 6.706zm.614-1.27a.52.52 0 0 0-.437.305l1.824.82a1.48 1.48 0 0 1-1.24.869z" /></Svg>
}
const ForwardRef = forwardRef(SvgForward2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
