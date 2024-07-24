import { eq } from 'drizzle-orm'

import { db } from '~/db'
import { users } from '~/db/schema'

interface Session {
  expires: string
  invitation: Invitation
  sessionToken: string
  user: User
  userId: string
}

interface Invitation {
  code: string
  createdAt: string
  fromUserId: string
  toUserId: string
}

interface User {
  createdAt: string
  email: string
  emailVerified: any
  handle: string
  id: string
  image: string
  name: string
}

export async function getSession(authToken: string): Promise<Session> {
  const response = await fetch('https://api.dev.follow.is/auth/session', {
    headers: {
      cookie: `authjs.session-token=${authToken}`,
    },
    credentials: 'omit',
  })
  return await response.json()
}

export async function saveSessionToUserTable(
  session: Session,
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
        expires: session.expires,
        sessionToken: session.sessionToken,
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
      expires: session.expires,
      sessionToken: session.sessionToken,
    })
}
