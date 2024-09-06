import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgCheckCircleFilled(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m4.95 7.795a1 1 0 0 0-1.415-1.414l-4.95 4.95-2.12-2.121a1 1 0 0 0-1.415 1.414l2.829 2.828a1 1 0 0 0 1.414 0z" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgCheckCircleFilled)
const Memo = memo(ForwardRef)
export default Memo
