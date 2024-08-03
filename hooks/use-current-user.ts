import { db } from '~/db'

import { useQuerySubscription } from './use-query-subscription'

export function useCurrentUser() {
  const { data: user, error } = useQuerySubscription(db.query.users.findFirst(), 'current-user')
  return {
    user,
    error,
  }
}
