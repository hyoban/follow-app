import { useAtomValue } from 'jotai'
import { ActivityIndicator } from 'react-native'

import { isLoadingAtom } from '~/atom/loading'

export function LoadingIndicator() {
  const isLoading = useAtomValue(isLoadingAtom)
  if (!isLoading)
    return null
  return <ActivityIndicator />
}
