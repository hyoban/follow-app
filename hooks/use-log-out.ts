import { eq } from 'drizzle-orm'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'

import { db } from '~/db'
import { users } from '~/db/schema'

import { useCurrentUser } from './use-current-user'

export function useLogOut() {
  const { user } = useCurrentUser()
  const router = useRouter()
  return useCallback(async () => {
    if (!user) {
      throw new Error('User not found')
    }

    await db.delete(users).where(eq(users.id, user.id))
    router.dismissAll()
    router.push('/auth')
  }, [router, user])
}
