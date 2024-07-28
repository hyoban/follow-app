import { usePathname } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'

import { views } from '~/consts/view'

export function useTabTitle() {
  const pathname = usePathname()
  const viewName = useMemo(() => pathname === '/' ? 'index' : pathname.slice(1), [pathname])
  const [title, setTitle] = useState(views.find(view => view.name === viewName)?.title)

  useEffect(() => {
    const newTitle = views.find(view => view.name === viewName)?.title
    if (newTitle) {
      setTitle(newTitle)
    }
  }, [viewName])
  return title
}
