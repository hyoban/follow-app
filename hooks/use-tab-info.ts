import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'

import type { TabViewIndex } from '~/atom/layout'

export function useTabInfo() {
  const { view, title } = useLocalSearchParams<{ view?: string, title?: string }>()
  const tabInfoFromParams = useMemo(
    () => ({ view: view ? Number(view) as TabViewIndex : undefined, title }),
    [view, title],
  )

  return tabInfoFromParams
}
