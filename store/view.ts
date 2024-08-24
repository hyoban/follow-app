import { createContext } from 'react'
import { createStore } from 'zustand'

import type { TabViewIndex } from './layout'

interface ViewProps {
  view: TabViewIndex
  title: string
}

interface ViewState extends ViewProps {

}

type ViewStore = ReturnType<typeof createViewStore>

export function createViewStore(initProps?: Partial<ViewProps>) {
  const DEFAULT_PROPS: ViewProps = {
    view: 0,
    title: 'Articles',
  }
  return createStore<ViewState>()(_set => ({
    ...DEFAULT_PROPS,
    ...initProps,
  }))
}

export const ViewContext = createContext<ViewStore>(createViewStore())
