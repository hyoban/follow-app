import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgListCollapseCuteRe(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" fillRule="evenodd" d="M18.87 15.272c-.239-.283-.506-.473-.866-.473s-.626.19-.865.473c-.228.271-.464.669-.756 1.162-.072.121-.142.244-.212.367-.28.5-.507.903-.628 1.236-.126.348-.157.674.023.986.18.312.478.448.842.512.35.062.811.068 1.384.074.142.002.283.002.425 0 .572-.006 1.035-.012 1.384-.074.364-.064.662-.2.842-.512.18-.312.15-.638.023-.986-.121-.334-.348-.736-.628-1.236-.07-.123-.14-.245-.213-.367-.291-.493-.527-.89-.755-1.162M18.87 5.272c-.239-.284-.506-.474-.866-.474s-.626.19-.865.474c-.228.271-.464.669-.756 1.161-.072.122-.142.245-.212.368-.28.5-.507.902-.628 1.235-.126.349-.157.675.023.987.18.311.478.447.842.512.35.062.811.067 1.384.074h.425c.572-.007 1.035-.012 1.384-.074.364-.065.662-.2.842-.512.18-.312.15-.638.023-.987-.121-.333-.348-.736-.628-1.235-.07-.123-.14-.246-.213-.368-.291-.492-.527-.89-.755-1.161" clipRule="evenodd" /><Path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M4 5h8m-8 7h8m-8 7h8" /></Svg>
}
const ForwardRef = forwardRef(SvgListCollapseCuteRe)
const Memo = memo(ForwardRef)
export default Memo
