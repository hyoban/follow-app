import { useLocalSearchParams, usePathname } from 'expo-router'
import { useMemo } from 'react'

import type { TabViewIndex } from '~/atom/layout'
import { tabViewList } from '~/consts/view'

export function useTabInfo(): {
  view: TabViewIndex
  title: string
} {
  const { view, title } = useLocalSearchParams<{ view?: string, title?: string }>()
  const tabInfoFromParams = useMemo(() => ({ view: view ? Number(view) as TabViewIndex : undefined, title }), [view, title])

  const pathname = usePathname()
  const tabInfoFromPath = useMemo(() => {
    const tabView = tabViewList.find(view => view.path === pathname)
    return tabView ? { view: tabView.view, title: tabView.title } : { view: 0 as TabViewIndex, title: 'Articles' }
  }, [pathname])

  return (tabInfoFromParams.view !== undefined && tabInfoFromParams.title !== undefined)
    ? tabInfoFromParams as { view: TabViewIndex, title: string }
    : tabInfoFromPath
}
