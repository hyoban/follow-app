import { db } from '~/db'

import type { AppType } from './hono'
import { getCsrfToken } from './session'

const { hc } = require('hono/dist/client') as typeof import('hono/client')

let csrfTokenPromise: Promise<string> | null = null

export const apiClient = hc<AppType>(process.env.EXPO_PUBLIC_FOLLOW_API_URL, {
  fetch: async (
    input: RequestInfo | URL,
    options?: RequestInit,
  ) => {
    const user = await db.query.users.findFirst()

    if (!user?.sessionToken || !options) {
      throw new Error('User not logged in or options not provided')
    }

    if (!csrfTokenPromise) {
      csrfTokenPromise = getCsrfToken(user.sessionToken)
    }

    const csrfToken = await csrfTokenPromise
    if (options && options.method && options.method.toLowerCase() !== 'get') {
      if (options.body instanceof FormData) {
        options.body.append('csrfToken', csrfToken)
      }
      else if (typeof options.body === 'string') {
        options.body = JSON.stringify({
          ...JSON.parse(options.body),
          csrfToken,
        })
      }
    }

    const header = new Headers(options.headers)
    header.set('cookie', `authjs.session-token=${user.sessionToken}; authjs.csrf-token=${csrfToken}; authjs.callback-url=${encodeURIComponent(process.env.EXPO_PUBLIC_FOLLOW_API_URL)}`)
    options.headers = header
    options.credentials = 'omit'

    return fetch(input, options)
  },
})
