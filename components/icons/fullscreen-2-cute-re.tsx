import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgFullscreen2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" color={theme.colors.gray12} ref={ref} {...props}><Path d="M24 0V24H0V0H24Z" fill="white" fillOpacity={0.01} /><Path d="M20 9C20.5077 7.4426 20.5547 6.02402 20.1459 4.49264C20.0831 4.25733 20.0516 4.13968 19.956 4.04452C19.8603 3.94935 19.7424 3.91856 19.5065 3.85697C17.9762 3.45733 16.5563 3.50421 15 4M9 20C7.4383 20.5196 6.01871 20.5677 4.48346 20.1467C4.25251 20.0834 4.13703 20.0517 4.04315 19.9573C3.94926 19.8629 3.9182 19.7472 3.85607 19.5157C3.4443 17.9815 3.49224 16.5606 4 15M4.1001 19.9L10.5001 13.5M13.5001 10.5L19.9001 4.09998" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
}
const ForwardRef = forwardRef(SvgFullscreen2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
