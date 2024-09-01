import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgWifiOffCuteRe(props: SvgProps, ref: Ref<Svg>) {
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" ref={ref} {...props}><Path fill="currentColor" d="M12 17a1 1 0 1 0 0 2zm.01 2a1 1 0 0 0 0-2zm4.94-5.95a1 1 0 0 0 1.414-1.414zm2.828-2.828a1 1 0 0 0 1.414-1.415zM2.808 8.807a1 1 0 0 0 1.414 1.415zm2.828 2.829A1 1 0 1 0 7.05 13.05zm2.828 2.828a1 1 0 1 0 1.414 1.414zM5.636 3.222a1 1 0 0 0-1.414 1.414zm12.728 15.556a1 1 0 0 0 1.414-1.414zm-7.309-8.723-.707.707zM12 19h.01v-2H12zm0-8c1.933 0 3.682.782 4.95 2.05l1.414-1.414A8.975 8.975 0 0 0 12 9zm0-4c3.038 0 5.786 1.23 7.778 3.222l1.414-1.415A12.962 12.962 0 0 0 12 5zm-7.778 3.222a11.055 11.055 0 0 1 1.82-1.471l-1.084-1.68a13.056 13.056 0 0 0-2.15 1.736zM7.05 13.05a7.023 7.023 0 0 1 1.803-1.305l-.9-1.786a9.023 9.023 0 0 0-2.317 1.677zM4.222 4.636 7.06 7.475 8.475 6.06 5.636 3.222zM8.12 7.703A10.973 10.973 0 0 1 12 7V5c-1.612 0-3.158.294-4.585.832zm-1.06-.228 3.288 3.287 1.414-1.414L8.475 6.06zm3.288 3.287 8.016 8.016 1.414-1.414-8.016-8.016zm.824.286c.271-.032.547-.048.828-.048V9c-.359 0-.713.02-1.062.062zm-1.294 4.83c.385-.384.87-.663 1.412-.794l-.47-1.944a4.995 4.995 0 0 0-2.356 1.324z" /></Svg>
}
const ForwardRef = forwardRef(SvgWifiOffCuteRe)
const Memo = memo(ForwardRef)
export default Memo