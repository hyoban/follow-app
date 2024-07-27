import type { ViewProps, ViewStyle } from 'react-native'
import { View } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import type { CommonProps } from './layout'

export type FlexProps = ViewProps & CommonProps & {
  direction?: ViewStyle['flexDirection']
  align?: ViewStyle['alignItems']
  justify?: ViewStyle['justifyContent']
  wrap?: ViewStyle['flexWrap']
  gap?: ViewStyle['gap']
  flex?: ViewStyle['flex']
}

export function Flex({
  direction: flexDirection,
  align: alignItems,
  justify: justifyContent,
  wrap: flexWrap,
  gap,
  flex,

  p: padding,
  px: paddingHorizontal,
  py: paddingVertical,
  pt: paddingTop,
  pr: paddingRight,
  pb: paddingBottom,
  pl: paddingLeft,

  m: margin,
  mx: marginHorizontal,
  my: marginVertical,
  mt: marginTop,
  mr: marginRight,
  mb: marginBottom,
  ml: marginLeft,

  w: width,
  minW: minWidth,
  maxW: maxWidth,

  h: height,
  minH: minHeight,
  maxH: maxHeight,

  bg = 'app',
  text: color,

  style,
  ...rest
}: FlexProps) {
  const { theme } = useStyles()
  return (
    <View
      style={{
        flexDirection,
        alignItems,
        justifyContent,
        flexWrap,
        gap,
        flex,

        padding,
        paddingHorizontal,
        paddingVertical,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,

        margin,
        marginHorizontal,
        marginVertical,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,

        width,
        minWidth,
        maxWidth,

        height,
        minHeight,
        maxHeight,

        backgroundColor: bg === 'app'
          ? theme.colors.gray1
          : bg === 'subtle'
            ? theme.colors.gray2
            : bg === 'component'
              ? theme.colors.gray3
              : bg,

        ...(typeof style === 'object' ? style : {}),
      }}
      {...rest}
    />
  )
}

export function Row(props: Omit<FlexProps, 'direction'>) {
  return <Flex direction="row" {...props} />
}

export function Column(props: Omit<FlexProps, 'direction'>) {
  return <Flex direction="column" {...props} />
}

export function Container(props: FlexProps) {
  return <Flex w="100%" h="100%" {...props} />
}
