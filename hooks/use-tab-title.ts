import { usePathname } from 'expo-router'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'

import { views } from '~/consts/view'

export const tabTitleAtom = atom('')

export function useTab() {
  const [title, setTitle] = useAtom(tabTitleAtom)

  const pathname = usePathname()
  const viewName = useMemo(() => pathname === '/' ? 'index' : pathname.slice(1), [pathname])

  useEffect(() => {
    const view = views.find(view => view.name === viewName)
    const newTitle = view?.title
    if (newTitle) {
      setTitle(newTitle)
    }
  }, [setTitle, viewName])

  return { title }
}
