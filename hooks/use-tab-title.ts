import { usePathname } from 'expo-router'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'

import type { TabView } from '~/atom/layout'
import { views } from '~/consts/view'

export const tabTitleAtom = atom('')
const viewAtom = atom<TabView>(0)

export function useTab() {
  const [title, setTitle] = useAtom(tabTitleAtom)
  const [view, setView] = useAtom(viewAtom)

  const pathname = usePathname()
  const viewName = useMemo(() => pathname === '/' ? 'index' : pathname.slice(1), [pathname])

  useEffect(() => {
    const view = views.find(view => view.name === viewName)
    const newTitle = view?.title
    if (newTitle) {
      setTitle(newTitle)
    }
    if (view?.view !== undefined) {
      setView(view.view as TabView)
    }
  }, [setTitle, setView, viewName])

  return { title, view }
}
