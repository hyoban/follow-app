import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgShare3CuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path stroke="#10161F" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 13c1.63-4.89 6.582-7.787 8.358-8.692.21-.107.181-.431-.049-.487-1.794-.434-3.483-.574-5.309-.07m-5-.233c-2.172.055-3.45.275-4.328 1.153C3.5 5.842 3.5 7.728 3.5 11.499v1c0 3.771 0 5.657 1.172 6.829 1.171 1.171 3.057 1.171 6.828 1.171h1c3.771 0 5.657 0 6.828-1.171C20.5 18.156 20.5 16.27 20.5 12.499v-1c0-.537 0-1.036-.003-1.5" /></Svg>
}
const Memo = memo(SvgShare3CuteRe)
export default Memo