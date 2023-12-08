'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSearchParamsKeys } from '@/lib/paths'
import { cn } from '@/lib/utils'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import Pagination from './pagination'

type Props<TData, TValue> =
  | {
      columns: ColumnDef<TData, TValue>[]
    }
  | {
      dynamicColumnGenerator?: (data: undefined) => ColumnDef<TData, TValue>[]
    }

export default function DataTableLoading<TData, TValue>({
  ...props
}: Props<TData, TValue>) {
  const columns =
    'columns' in props
      ? props.columns
      : props.dynamicColumnGenerator?.(undefined) || []
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get(TableSearchParamsKeys.Page)) || 1
  const currentPageSize =
    Number(searchParams.get(TableSearchParamsKeys.PageSize)) || 10

  const currentSortDirection =
    searchParams.get(TableSearchParamsKeys.SortDirection) || undefined
  const currentSortField =
    searchParams.get(TableSearchParamsKeys.SortBy) || undefined

  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting:
        currentSortDirection && currentSortField
          ? [
              {
                id: currentSortField,
                desc: currentSortDirection === 'desc',
              },
            ]
          : [],
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: currentPageSize,
      },
    },
    pageCount: Math.ceil(0 / currentPageSize),
    manualPagination: true,
    manualSorting: true,
  })

  return (
    <div>
      <div className={cn('rounded-md border')}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from(Array(currentPageSize).keys()).map((i) => (
              <TableRow
                className="w-full animate-pulse"
                key={`loading-row-${i}`}
              >
                {table.getAllColumns().map((column) => (
                  <TableCell key={column.id + `-${i}-skeleton-loader-cell`}>
                    <div className="-my-1 flex h-8 w-full rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} isLoading />
    </div>
  )
}
