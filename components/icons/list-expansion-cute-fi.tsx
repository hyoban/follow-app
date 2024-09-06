import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgListExpansionCuteFi(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" d="M4 3.5a1.5 1.5 0 1 0 0 3h7.5a1.5 1.5 0 0 0 0-3zM2.5 12A1.5 1.5 0 0 1 4 10.5h7.5a1.5 1.5 0 0 1 0 3H4A1.5 1.5 0 0 1 2.5 12M4 17.5a1.5 1.5 0 0 0 0 3h7.5a1.5 1.5 0 0 0 0-3z" /><Path fill="currentColor" fillRule="evenodd" d="M19.012 9.449c-.278.33-.588.551-1.007.551-.42 0-.73-.221-1.007-.551-.266-.316-.54-.778-.88-1.352a21.973 21.973 0 0 1-.247-.428c-.327-.581-.59-1.05-.731-1.438-.147-.405-.183-.784.026-1.147.21-.363.557-.522.981-.597.406-.072.944-.078 1.61-.086h.494c.667.008 1.205.014 1.611.086.424.075.771.234.98.597.21.363.174.742.027 1.147-.14.388-.404.857-.73 1.438-.081.144-.164.286-.248.428-.34.573-.614 1.036-.88 1.352M19.012 19.449c-.278.33-.588.551-1.007.551-.42 0-.73-.221-1.007-.551-.266-.316-.54-.779-.88-1.352a22.184 22.184 0 0 1-.247-.428c-.327-.581-.59-1.05-.731-1.438-.147-.405-.183-.785.026-1.147.21-.363.557-.522.981-.597.406-.072.944-.078 1.61-.086.165-.002.33-.002.494 0 .667.008 1.205.014 1.611.086.424.075.771.234.98.597.21.363.174.742.027 1.147-.14.388-.404.857-.73 1.438-.081.144-.164.286-.248.428-.34.573-.614 1.036-.88 1.352" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgListExpansionCuteFi)
const Memo = memo(ForwardRef)
export default Memo
