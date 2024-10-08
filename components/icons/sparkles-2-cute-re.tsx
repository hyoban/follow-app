import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgSparkles2CuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M10.906 2.577a1 1 0 0 0-1.812 0l-.165.352-.352.165a1 1 0 0 0 0 1.812l.352.165.165.352a1 1 0 0 0 1.812 0l.164-.352.353-.165a1 1 0 0 0 0-1.812l-.353-.165zM4.734 6.626a1.5 1.5 0 0 1 2.531 0l.432.677.677.432a1.5 1.5 0 0 1 0 2.53l-.677.432-.432.677a1.5 1.5 0 0 1-2.53 0l-.432-.677-.677-.431a1.5 1.5 0 0 1 0-2.531l.677-.432zM6 8.363l-.07.108a1.5 1.5 0 0 1-.46.46L5.363 9l.109.069a1.5 1.5 0 0 1 .46.46L6 9.637l.069-.108a1.5 1.5 0 0 1 .46-.46L6.637 9l-.108-.069a1.5 1.5 0 0 1-.46-.46zm6.144-.31a2.2 2.2 0 0 1 3.712 0l1.567 2.463a.2.2 0 0 0 .061.061l2.462 1.567a2.2 2.2 0 0 1 0 3.712l-2.462 1.567a.2.2 0 0 0-.061.061l-1.567 2.462a2.2 2.2 0 0 1-3.712 0l-1.567-2.462a.2.2 0 0 0-.061-.061l-2.462-1.567a2.2 2.2 0 0 1 0-3.712l2.462-1.567a.2.2 0 0 0 .061-.061zm2.025 1.075a.2.2 0 0 0-.338 0l-1.567 2.462a2.199 2.199 0 0 1-.675.674l-2.461 1.567a.2.2 0 0 0 0 .338l2.461 1.567c.272.172.502.403.675.674l1.567 2.462a.2.2 0 0 0 .338 0l1.566-2.462c.173-.271.404-.502.675-.674l2.462-1.567a.2.2 0 0 0 0-.338l-2.462-1.567a2.199 2.199 0 0 1-.675-.674z" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgSparkles2CuteRe)
const Memo = memo(ForwardRef)
export default Memo
