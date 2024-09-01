import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgVideoCuteFi(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M13.573 2.5h-3.146c-1.824 0-3.293 0-4.45.155-1.2.162-2.21.507-3.013 1.31-.802.802-1.147 1.813-1.309 3.013C1.5 8.134 1.5 9.603 1.5 11.427v1.146c0 1.824 0 3.293.155 4.45.162 1.2.507 2.21 1.31 3.012.802.803 1.813 1.148 3.013 1.31 1.156.155 2.625.155 4.449.155h3.146c1.824 0 3.293 0 4.45-.155 1.2-.162 2.21-.507 3.012-1.31.803-.802 1.148-1.812 1.31-3.013.155-1.156.155-2.625.155-4.449v-1.146c0-1.824 0-3.293-.155-4.45-.162-1.2-.507-2.21-1.31-3.013-.802-.802-1.812-1.147-3.013-1.309-1.156-.155-2.625-.155-4.449-.155m-.317 6.618a34.67 34.67 0 0 0-.942-.523c-.419-.225-.85-.456-1.241-.578-.485-.15-1.03-.174-1.575.141-.547.316-.799.799-.91 1.294-.09.4-.106.89-.12 1.365a34.39 34.39 0 0 0 0 2.158c.014.474.03.963.12 1.362.112.495.364.977.91 1.292.546.315 1.09.293 1.574.142.391-.122.822-.353 1.24-.578a35.066 35.066 0 0 0 1.874-1.082c.402-.25.817-.506 1.117-.784.373-.344.663-.803.664-1.432 0-.63-.29-1.089-.663-1.434-.3-.278-.715-.535-1.117-.784-.289-.18-.595-.365-.93-.559" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgVideoCuteFi)
const Memo = memo(ForwardRef)
export default Memo
