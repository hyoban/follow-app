import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgTwitterCuteFi(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M14.732 3.678c1.997-.401 3.548.266 4.492 1.133.272.25.643.07.97.01 1.28-.24 2.255 1.127 1.61 2.259-.286.504-1.283 1.685-1.263 2.251.163 4.6-1.118 7.8-3.832 10.001-1.375 1.116-3.32 1.772-5.466 2.008-2.161.238-4.607.06-7.064-.572-1.243-.319-1.136-1.974-.042-2.304 1.036-.311 1.865-.624 2.629-1.117-2.198-1.136-3.36-2.863-3.888-4.668-.57-1.946-.394-3.937-.13-5.33a1.892 1.892 0 0 1 1.53-1.53 2.214 2.214 0 0 1 1.96.618c1.313 1.303 2.8 1.906 4.42 2.072a.265.265 0 0 0 .056-.13c.129-1.042.454-2.084 1.108-2.943.67-.878 1.635-1.502 2.91-1.758" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgTwitterCuteFi)
const Memo = memo(ForwardRef)
export default Memo
