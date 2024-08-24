import { useLocalSearchParams } from 'expo-router'
import { useContext, useMemo } from 'react'
import { useStore } from 'zustand'

import type { TabViewIndex } from '~/store/layout'
import { ViewContext } from '~/store/view'

export function useTabInfo() {
  const { view, title } = useLocalSearchParams<{ view?: string, title?: string }>()
  const tabInfoFromParams = useMemo(
    () => ({ view: view ? Number(view) as TabViewIndex : undefined, title }),
    [view, title],
  )

  const store = useContext(ViewContext)
  const state = useStore(store)

  return tabInfoFromParams.view !== undefined ? tabInfoFromParams : state
}
