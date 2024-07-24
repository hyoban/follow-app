import { ofetch } from 'ofetch'

import { db } from '~/db'

import type { AppType } from './hono'

const { hc } = require('hono/dist/client') as typeof import('hono/client')

// let csrfTokenPromise: Promise<string> | null = null
export const apiFetch = ofetch.create({
  baseURL: 'https://api.dev.follow.is',
  credentials: 'omit',
  retry: false,
  onRequest: async ({ options }) => {
    // TODO: Add CSRF token
    // if (!csrfTokenPromise) {
    //   csrfTokenPromise = getCsrfToken()
    // }

    // const csrfToken = await csrfTokenPromise
    // if (options.method && options.method.toLowerCase() !== 'get') {
    //   if (typeof options.body === 'string') {
    //     options.body = JSON.parse(options.body)
    //   }
    //   if (!options.body) {
    //     options.body = {}
    //   }
    //   if (options.body instanceof FormData) {
    //     options.body.append('csrfToken', csrfToken)
    //   }
    //   else {
    //     (options.body as Record<string, unknown>).csrfToken = csrfToken
    //   }
    // }

    const header = new Headers()
    const user = await db.query.users.findFirst()
    if (user?.sessionToken) {
      header.set('cookie', `authjs.session-token=${user.sessionToken}`)
    }
    options.headers = header
  },
})

export const apiClient = hc<AppType>('', {
  fetch: async (
    input: RequestInit | string | URL,
    options = {},
  ) => apiFetch(
    input.toString(),
    options,
  ),
})
