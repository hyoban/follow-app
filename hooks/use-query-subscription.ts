import { is, SQL, Subquery } from 'drizzle-orm'
import type { AnySQLiteSelect } from 'drizzle-orm/sqlite-core'
import { getTableConfig, getViewConfig, SQLiteTable, SQLiteView } from 'drizzle-orm/sqlite-core'
import { SQLiteRelationalQuery } from 'drizzle-orm/sqlite-core/query-builders/query'
import { addDatabaseChangeListener } from 'expo-sqlite/next'
import type { Key } from 'swr'
import type { SWRSubscriptionOptions } from 'swr/subscription'
import useSWRSubscription from 'swr/subscription'

export function useQuerySubscription<
  T extends
  | Pick<AnySQLiteSelect, '_' | 'then'>
  | SQLiteRelationalQuery<'sync', unknown>,
  SWRSubKey extends Key,
>(
  query: T,
  key: SWRSubKey,
  options?: {
    afterRevalidate?: (data: Awaited<T>) => void
  },
) {
  function subscribe(_key: SWRSubKey, { next }: SWRSubscriptionOptions<Awaited<T>, any>) {
    const entity = is(query, SQLiteRelationalQuery)
    // @ts-expect-error
      ? query.table
      // @ts-expect-error
      : (query as AnySQLiteSelect).config.table

    if (is(entity, Subquery) || is(entity, SQL)) {
      next(new Error('Selecting from subqueries and SQL are not supported in useQuerySubscription'))
      return
    }

    query.then((data) => { next(undefined, data) })
      .catch((error) => { next(error) })

    let listener: ReturnType<typeof addDatabaseChangeListener> | undefined

    if (is(entity, SQLiteTable) || is(entity, SQLiteView)) {
      const config = is(entity, SQLiteTable) ? getTableConfig(entity) : getViewConfig(entity)

      let queryTimeout: NodeJS.Timeout | undefined
      listener = addDatabaseChangeListener(({ tableName }) => {
        if (config.name === tableName) {
          if (queryTimeout) {
            clearTimeout(queryTimeout)
          }
          queryTimeout = setTimeout(() => {
            query.then((data) => {
              next(undefined, data)
              if (options?.afterRevalidate) {
                options.afterRevalidate(data)
              }
            })
              .catch((error) => { next(error) })
          }, 0)
        }
      })
    }

    return () => {
      listener?.remove()
    }
  }

  return useSWRSubscription<Awaited<T>, any, SWRSubKey>(
    key,
    subscribe as any,
  )
}
