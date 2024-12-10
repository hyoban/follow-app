import { eq } from 'drizzle-orm'

import { db } from '~/db'
import { users } from '~/db/schema'

interface GetSessionReturn {
  user: User
  session: Session
  invitation: Invitation
  role: string
}

interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string
  createdAt: string
  updatedAt: string
  handle: string
}

interface Session {
  id: string
  expiresAt: string
  token: string
  createdAt: string
  updatedAt: string
  ipAddress: string
  userAgent: string
  userId: string
}

interface Invitation {
  code: string
  createdAt: string
  fromUserId: string
  toUserId: string
}

export async function getSession(authToken: string): Promise<GetSessionReturn> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_FOLLOW_API_URL}/better-auth/get-session`,
    {
      headers: {
        cookie: `better-auth.session_token=${authToken}`,
      },
      credentials: 'omit',
    },
  )
  return await response.json()
}

export async function saveSessionToUserTable(
  token: string,
  result: GetSessionReturn,
) {
  const userInDb = await db.query.users.findFirst()
  if (userInDb) {
    await db.update(users)
      .set({
        email: result.user.email,
        name: result.user.name,
        handle: result.user.handle,
        image: result.user.image,
        createdAt: result.user.createdAt,
        expires: result.session.expiresAt,
        sessionToken: token,
      })
      .where(eq(users.id, result.user.id))
    return
  }

  await db.insert(users)
    .values({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      handle: result.user.handle,
      image: result.user.image,
      createdAt: result.user.createdAt,
      expires: result.session.expiresAt,
      sessionToken: token,
    })
}
