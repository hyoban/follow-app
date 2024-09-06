import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgDiscordCuteFi(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M9.99 5.147A13.65 13.65 0 0 1 12 5c.692 0 1.366.05 2.014.148A1.012 1.012 0 0 1 15.004 4c.93 0 1.924.406 2.777.763 1.26.528 1.968 1.636 2.517 2.853.89 1.975 1.509 4.608 1.723 6.61.102.95.127 1.906-.056 2.549-.245.858-1.232 1.403-1.995 1.824l-.18.1c-.687.384-1.446.756-1.97 1.013l-.37.182a1 1 0 1 1-.894-1.788l.416-.206.375-.184-.58-.609c-1.39.57-3.028.893-4.767.893-1.739 0-3.376-.322-4.766-.893l-.58.608.339.166.455.225a1 1 0 1 1-.895 1.788l-.544-.27c-.604-.298-1.208-.596-1.796-.925a54.33 54.33 0 0 0-.18-.1c-.762-.42-1.749-.966-1.994-1.824-.184-.643-.158-1.598-.056-2.55.214-2.001.832-4.634 1.723-6.609.549-1.217 1.257-2.325 2.517-2.853C7.06 4.413 8.072 4 9 4c.603 0 1.077.555.99 1.147m.51 7.103a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0M15.25 14a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgDiscordCuteFi)
const Memo = memo(ForwardRef)
export default Memo
