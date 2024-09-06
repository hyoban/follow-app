import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgGithubCuteFi(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M7.024 2.31a9.08 9.08 0 0 1 2.125 1.046A11.432 11.432 0 0 1 12 3c.993 0 1.951.125 2.849.356a9.081 9.081 0 0 1 2.125-1.045l.103-.036c.69-.236 1.615-.554 2.176.067.4.444.5 1.188.572 1.756.08.634.098 1.46-.112 2.28C20.516 7.415 21 8.653 21 10c0 2.042-1.106 3.815-2.743 5.043a9.456 9.456 0 0 1-2.59 1.356c.214.49.333 1.032.333 1.601v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-.991c-.955.117-1.756.014-2.437-.276-.712-.302-1.208-.77-1.58-1.218a9.757 9.757 0 0 1-.482-.638l-.075-.107c-.11-.156-.2-.286-.295-.408-.234-.303-.363-.385-.447-.413a1 1 0 1 1 .632-1.897c.666.222 1.1.702 1.397 1.087.126.162.25.338.359.495l.064.091c.133.188.254.356.382.51.253.303.506.522.826.657.313.133.772.22 1.489.122L8 17.98a3.985 3.985 0 0 1 .334-1.58 9.456 9.456 0 0 1-2.59-1.357C4.105 13.815 3 12.043 3 10c0-1.346.484-2.582 1.285-3.618-.211-.82-.193-1.648-.113-2.283l.005-.038c.073-.582.159-1.267.566-1.719.561-.621 1.489-.303 2.178-.067z" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgGithubCuteFi)
const Memo = memo(ForwardRef)
export default Memo
