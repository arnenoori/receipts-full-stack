import { TableStateSchema } from '@/types/table-types'
import { SQL, Table, asc, desc, getTableColumns } from 'drizzle-orm'
import { NonUndefined } from 'react-hook-form'
import { z } from 'zod'

/**
 * Get the orderBy function for a table
 *
 * This method is used for calls that need to sort a table by a column.
 * You provide the table, sort input values, and the available columns to sort by.
 * It will validate that the input sort values are valid, and return the orderBy function
 *
 */

const SortSchema = TableStateSchema.pick({ sortBy: true, sortDirection: true })
type SortInput = z.infer<typeof SortSchema>

type Columns<T extends Table> = T['_']['columns']
type ColumnStringKey<T extends Table> = keyof Columns<T> extends string
  ? keyof Columns<T>
  : never
type ColumnKeys<T extends Table> = [ColumnStringKey<T>, ...ColumnStringKey<T>[]]

export function getOrderByFunc<T extends Table, V extends ColumnKeys<T>>(
  table: T,
  opts: {
    sortByColumnOptions: V
    defaultSortColumn: NonUndefined<V[number]> // make sure that the default sort column is in the sortByColumnOptions
    input: SortInput
    aliasedColumns?: [SQL.Aliased, ...SQL.Aliased[]]
  }
) {
  const orderByFunc = opts.input.sortDirection === 'desc' ? desc : asc

  // if the sortBy value is an aliased column, use that
  if (opts.aliasedColumns && opts.input.sortBy) {
    const found = opts.aliasedColumns.find(
      (v) => v.fieldAlias === opts.input.sortBy
    )
    if (found) return orderByFunc(found)
  }

  const sortBySchema = z
    .enum(opts.sortByColumnOptions)
    .default(opts.defaultSortColumn)

  const safeSortBy = sortBySchema.safeParse(opts.input.sortBy)

  if (!safeSortBy.success) {
    // if the sortBy value is invalid, return the default sort column
    const v = getTableColumns(table)[opts.defaultSortColumn]
    if (!v) throw new Error('Invalid default sort column')
    return orderByFunc(v)
  }

  const v = getTableColumns(table)[safeSortBy.data]
  if (!v) throw new Error('Invalid sort column')
  return orderByFunc(v)
}
