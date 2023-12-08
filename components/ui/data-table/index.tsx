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
import { MouseEventHandler } from 'react'
import Pagination from './pagination'

type DataTableData<TData> = {
  items: TData[]
  total: number
}

type StaticColumnGenerator<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
}

type DynamicColumnGenerator<T extends DataTableData<TData>, TData, TValue> = {
  dynamicColumnGenerator: (data: T) => ColumnDef<TData, TValue>[]
}

type Props<T extends DataTableData<TData>, TData, TValue> = {
  onRowClick?: (row: TData) => void
  data: T
} & (
  | StaticColumnGenerator<TData, TValue>
  | DynamicColumnGenerator<T, TData, TValue>
)

export default function DataTable<
  T extends { items: TData[]; total: number },
  TData,
  TValue,
>({ ...props }: Props<T, TData, TValue>) {
  const searchParams = useSearchParams()
  const { onRowClick, data } = props

  // get the columns from the props or generate them dynamically
  const columns =
    'columns' in props ? props.columns : props.dynamicColumnGenerator(data)

  const currentPage = Number(searchParams.get(TableSearchParamsKeys.Page)) || 1
  const currentPageSize =
    Number(searchParams.get(TableSearchParamsKeys.PageSize)) || 10

  const currentSortDirection =
    searchParams.get(TableSearchParamsKeys.SortDirection) || undefined
  const currentSortField =
    searchParams.get(TableSearchParamsKeys.SortBy) || undefined

  const table = useReactTable({
    data: data.items,
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
    pageCount: Math.ceil((data.total ?? 0) / currentPageSize),
    manualPagination: true,
    manualSorting: true,
  })

  const handleRowClick = (
    e: Parameters<MouseEventHandler<HTMLTableRowElement>>[0],
    row: TData
  ) => {
    const target = e.target as HTMLElement

    // if parent or grandparent is not a td or tr, then it's not a click on the row
    if (
      !target.parentElement ||
      !target.parentElement.parentElement ||
      !target.parentElement.parentElement.matches('td, tr') ||
      !target.parentElement.matches('td, tr')
    ) {
      return
    }

    onRowClick?.(row)
  }

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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={(e) => handleRowClick(e, row.original)}
                className={cn(onRowClick !== undefined && 'cursor-pointer')}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data.items.length > 0 && <Pagination table={table} />}
    </div>
  )
}
