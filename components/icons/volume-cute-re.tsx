import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgVolumeCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9.763c.614.55 1 1.348 1 2.236 0 .889-.386 1.687-1 2.236m2-6.708A5.985 5.985 0 0 1 21 12a5.985 5.985 0 0 1-2 4.472m-12.005-.176L9.498 18.3c1.807 1.445 2.71 2.168 3.537 1.812.826-.355.92-1.468 1.11-3.694.253-2.991.253-5.843 0-8.834-.19-2.226-.284-3.34-1.11-3.694-.827-.355-1.73.367-3.537 1.813L6.995 7.704a3.634 3.634 0 0 1-2.27.796v0A2.725 2.725 0 0 0 2 11.225v1.55A2.725 2.725 0 0 0 4.725 15.5v0c.825 0 1.626.28 2.27.796" /></Svg>
}
const ForwardRef = forwardRef(SvgVolumeCuteRe)
const Memo = memo(ForwardRef)
export default Memo
