import { db } from '~/db'

import type { AppType } from './hono'

const { hc } = require('hono/dist/client') as typeof import('hono/client')

export const apiClient = hc<AppType>(process.env.EXPO_PUBLIC_FOLLOW_API_URL, {
  fetch: async (
    input: RequestInfo | URL,
    options?: RequestInit,
  ) => {
    const user = await db.query.users.findFirst()

    if (!user?.sessionToken || !options) {
      throw new Error('User not logged in or options not provided')
    }

    const header = new Headers(options.headers)
    header.set('cookie', `better-auth.session_token=${user.sessionToken};`)
    options.headers = header
    options.credentials = 'omit'

    return fetch(input, options)
  },
})
