import { Portal } from '@gorhom/portal'
import type { MenuComponentProps } from '@react-native-menu/menu'
import { MenuView } from '@react-native-menu/menu'
import { useState } from 'react'
import type { ViewStyle } from 'react-native'
import { Dimensions, Pressable } from 'react-native'

export type MenuProps = MenuComponentProps

export default function Menu({ children, ...props }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const onPressAction: MenuComponentProps['onPressAction'] = ({ nativeEvent }) => {
    setIsOpen(false)
    props.onPressAction?.({ nativeEvent })
  }

  return (
    <MenuView {...props} onPressAction={onPressAction}>
      <Pressable onPress={() => setIsOpen(true)}>{children}</Pressable>
      <Portal>
        {isOpen && <Pressable style={absoluteViewStyle} onPress={() => setIsOpen(false)} />}
      </Portal>
    </MenuView>
  )
}

const screenSize = Dimensions.get('screen')

const absoluteViewStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: screenSize.width,
  height: screenSize.height,

  zIndex: 999,
}
