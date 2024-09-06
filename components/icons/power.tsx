import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgPower(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" color={theme.colors.gray12} ref={ref} {...props}><Path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5229 22 22 17.5229 22 12C22 6.47715 17.5229 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5229 6.47715 22 12 22ZM10.4293 12.7184H8.70693C8.15511 12.7184 7.85969 12.0662 8.22199 11.6481L12.4415 6.85452C12.8316 6.4086 13.5674 6.6873 13.5674 7.27814V11.2914H15.2898C15.8472 11.2914 16.1426 11.9436 15.7748 12.3616L11.5553 17.1552C11.1651 17.6012 10.4293 17.3225 10.4293 16.7316V12.7184Z" fill="#FF5C00" /></Svg>
}
const ForwardRef = forwardRef(SvgPower)
const Memo = memo(ForwardRef)
export default Memo
