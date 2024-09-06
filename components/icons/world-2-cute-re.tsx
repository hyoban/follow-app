import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgWorld2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="m14.165 3.262-.372 1.81c-.033.161-.05.241-.07.314a2 2 0 0 1-1.332 1.362c-.072.022-.152.04-.311.077l-.441.1a1.784 1.784 0 0 0-1.363 2.033v0a1.784 1.784 0 0 1-2.281 2l-.16-.05A1.887 1.887 0 0 1 6.5 9.104V4.876M15 20.5l-.854-2.988-.008-.027a2 2 0 0 0-.495-.842l-.02-.02-.183-.184a1.822 1.822 0 0 1 .15-2.71v0a1.822 1.822 0 0 1 1.953-.208l.599.3c.4.2.601.3.767.433a2 2 0 0 1 .632.885c.072.2.102.422.161.866l.357 2.65M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Svg>
}
const ForwardRef = forwardRef(SvgWorld2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
