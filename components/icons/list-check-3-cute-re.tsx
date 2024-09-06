import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgListCheck3CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4h8m-8 4h4m-4 6h8m-8 4h4M5.5 19.25c.465 0 .697 0 .89-.034a2.25 2.25 0 0 0 1.826-1.825c.034-.194.034-.426.034-.891v0c0-.465 0-.697-.034-.89a2.25 2.25 0 0 0-1.825-1.826c-.194-.034-.426-.034-.891-.034v0c-.465 0-.697 0-.89.034a2.25 2.25 0 0 0-1.826 1.825c-.034.194-.034.426-.034.891v0c0 .465 0 .697.034.89a2.25 2.25 0 0 0 1.825 1.826c.194.034.426.034.891.034m0-10c.465 0 .697 0 .89-.034A2.25 2.25 0 0 0 8.217 7.39c.034-.194.034-.426.034-.891v0c0-.465 0-.697-.034-.89A2.25 2.25 0 0 0 6.39 3.783c-.194-.034-.426-.034-.891-.034v0c-.465 0-.697 0-.89.034A2.25 2.25 0 0 0 2.783 5.61c-.034.194-.034.426-.034.891v0c0 .465 0 .697.034.89A2.25 2.25 0 0 0 4.61 9.217c.194.034.426.034.891.034" /></Svg>
}
const ForwardRef = forwardRef(SvgListCheck3CuteRe)
const Memo = memo(ForwardRef)
export default Memo
