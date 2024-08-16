import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgArrowRightCircleCuteFi(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path fill="#10161F" fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10M11.819 8.014a1 1 0 0 0 .443 1.343c.887.447 1.58.977 2.146 1.643h-6.65a1 1 0 1 0 0 2h6.65c-.566.666-1.258 1.195-2.146 1.642a1 1 0 1 0 .9 1.787c1.456-.734 2.564-1.692 3.422-3.01.214-.327.539-.772.539-1.42 0-.646-.325-1.092-.539-1.42-.859-1.316-1.966-2.275-3.422-3.008a1 1 0 0 0-1.344.443" clipRule="evenodd" /></Svg>
}
const Memo = memo(SvgArrowRightCircleCuteFi)
export default Memo