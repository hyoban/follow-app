import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgDepartmentCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path stroke="currentColor" strokeLinejoin="round" strokeWidth={2} d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v4m-6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></Svg>
}
const ForwardRef = forwardRef(SvgDepartmentCuteRe)
const Memo = memo(ForwardRef)
export default Memo
