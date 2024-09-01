import { ofetch } from 'ofetch'

import { db } from '~/db'

import type { AppType } from './hono'
import { getCsrfToken } from './session'

const { hc } = require('hono/dist/client') as typeof import('hono/client')

let csrfTokenPromise: Promise<string> | null = null
export const apiFetch = ofetch.create({
  baseURL: process.env.EXPO_PUBLIC_FOLLOW_API_URL,
  credentials: 'omit',
  retry: false,
  onRequest: async ({ options }) => {
    const user = await db.query.users.findFirst()

    if (user?.sessionToken) {
      if (!csrfTokenPromise) {
        csrfTokenPromise = getCsrfToken(user.sessionToken)
      }

      const csrfToken = await csrfTokenPromise
      if (options.method && options.method.toLowerCase() !== 'get') {
        if (typeof options.body === 'string') {
          options.body = JSON.parse(options.body)
        }
        if (!options.body) {
          options.body = {}
        }
        if (options.body instanceof FormData) {
          options.body.append('csrfToken', csrfToken)
        }
        else {
          (options.body as Record<string, unknown>).csrfToken = csrfToken
        }
      }

      const header = new Headers(options.headers)
      header.set('cookie', `authjs.session-token=${user.sessionToken}`)
      options.headers = header
    }
  },
  onResponseError(context) {
    console.info('onResponseError', context.request)
  },
})

export const apiClient = hc<AppType>('', {
  fetch: async (
    input: RequestInfo | URL,
    options = {},
  ) => await apiFetch(
    input.toString(),
    options,
  ),
})
