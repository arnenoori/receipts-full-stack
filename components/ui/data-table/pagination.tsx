'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableSearchParamsKeys } from '@/lib/paths'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'
import { Table } from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Skeleton } from '../skeleton'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  isLoading?: boolean
}

export default function Pagination<TData>({
  table,
  isLoading = false,
}: DataTablePaginationProps<TData>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentPage = Number(searchParams.get(TableSearchParamsKeys.Page)) || 1
  const currentPageSize =
    Number(searchParams.get(TableSearchParamsKeys.PageSize)) || 10

  const setPageIndex = (pageIx: number) => {
    const params = new URLSearchParams(searchParams)
    params.set(TableSearchParamsKeys.Page, (pageIx + 1).toString())

    replace(`${pathname}?${params.toString()}`)
  }

  const setPageSize = (pageSize: number) => {
    const params = new URLSearchParams(searchParams)
    params.set(TableSearchParamsKeys.PageSize, pageSize.toString())

    replace(`${pathname}?${params.toString()}`)
  }

  const numSelected = table.getFilteredSelectedRowModel().rows.length

  const rowsPerPage = (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Rows per page</p>
      <Select
        value={`${currentPageSize}`}
        onValueChange={(value) => {
          setPageSize(Number(value))
        }}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={currentPageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[5, 10, 20, 30].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="mt-4 flex items-center justify-between px-2">
      {numSelected > 0 ? (
        <div className="flex-1 text-sm text-muted-foreground">
          {numSelected} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
      ) : (
        rowsPerPage
      )}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {numSelected > 0 && rowsPerPage}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of
          {!isLoading ? (
            ` ${table.getPageCount()}`
          ) : (
            <Skeleton className="ml-2 h-4 w-4" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex(currentPage - 2)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex(currentPage)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
