import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgRssCuteFi(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M11.427 2.5h1.146c1.824 0 3.293 0 4.45.155 1.2.162 2.21.507 3.012 1.31.803.802 1.148 1.813 1.31 3.013.155 1.156.155 2.625.155 4.449v1.146c0 1.824 0 3.293-.155 4.45-.162 1.2-.507 2.21-1.31 3.012-.802.803-1.812 1.148-3.013 1.31-1.156.155-2.625.155-4.449.155h-1.146c-1.824 0-3.293 0-4.45-.155-1.2-.162-2.21-.507-3.013-1.31-.802-.802-1.147-1.812-1.309-3.013-.155-1.156-.155-2.625-.155-4.449v-1.146c0-1.824 0-3.293.155-4.45.162-1.2.507-2.21 1.31-3.013.802-.802 1.813-1.147 3.013-1.309C8.134 2.5 9.603 2.5 11.427 2.5M8.5 9c-.146 0-.29.005-.434.014a1 1 0 1 1-.132-1.995 8.5 8.5 0 0 1 9.047 9.047 1 1 0 1 1-1.995-.132A6.5 6.5 0 0 0 8.5 9M7 11.5a1 1 0 0 1 1-1 5.5 5.5 0 0 1 5.5 5.5 1 1 0 1 1-2 0A3.5 3.5 0 0 0 8 12.5a1 1 0 0 1-1-1m0 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgRssCuteFi)
const Memo = memo(ForwardRef)
export default Memo
