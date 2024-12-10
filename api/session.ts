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
  session: GetSessionReturn,
) {
  const userInDb = await db.query.users.findFirst()
  if (userInDb) {
    await db.update(users)
      .set({
        email: session.user.email,
        name: session.user.name,
        handle: session.user.handle,
        image: session.user.image,
        createdAt: session.user.createdAt,
        expires: session.session.expiresAt,
        sessionToken: session.session.token,
      })
      .where(eq(users.id, session.user.id))
    return
  }

  await db.insert(users)
    .values({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      handle: session.user.handle,
      image: session.user.image,
      createdAt: session.user.createdAt,
      expires: session.session.expiresAt,
      sessionToken: session.session.token,
    })
}
