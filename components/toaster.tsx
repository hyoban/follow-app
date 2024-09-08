import { usePathname } from 'expo-router'
import { useMemo } from 'react'
import { Toaster as SoonerToaster } from 'sonner-native'

import { tabViewList } from '~/consts/view'

export function Toaster() {
  const pathname = usePathname()
  const isInTabView = useMemo(
    () => tabViewList.some(tabView => tabView.path === pathname),
    [pathname],
  )
  return (
    <SoonerToaster
      position="bottom-center"
      offset={isInTabView ? 75 : undefined}
      duration={1000}
    />
  )
}
