import { useAtomValue } from 'jotai'
import { ActivityIndicator } from 'react-native'

import { isLoadingAtom } from '~/atom/loading'

export function LoadingIndicator(props: React.ComponentProps<typeof ActivityIndicator>) {
  const isLoading = useAtomValue(isLoadingAtom)
  if (!isLoading)
    return null
  return <ActivityIndicator {...props} />
}
