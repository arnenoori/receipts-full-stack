'use client'

import { Check, ChevronsUpDown, EyeOff, SortAsc, SortDesc } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableSearchParamsKeys } from '@/lib/paths'
import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  align?: 'left' | 'center' | 'right'
}

export default function ColumnHeader<TData, TValue>({
  column,
  title,
  className,
  align,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentSortBy = searchParams.get(TableSearchParamsKeys.SortBy) || ''
  const currentSortDirection =
    searchParams.get(TableSearchParamsKeys.SortDirection) || ''

  const deleteSort = () => {
    const params = new URLSearchParams(searchParams)

    params.delete(TableSearchParamsKeys.SortBy)
    params.delete(TableSearchParamsKeys.SortDirection)

    replace(`${pathname}?${params.toString()}`)
  }

  const setSort = (desc: boolean) => {
    const params = new URLSearchParams(searchParams)

    params.set(TableSearchParamsKeys.SortBy, column.id)
    params.set(TableSearchParamsKeys.SortDirection, desc ? 'desc' : 'asc')

    replace(`${pathname}?${params.toString()}`)
  }

  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          className,
          align === 'center' && 'justify-center text-center',
          align === 'right' && 'justify-end text-right'
        )}
      >
        {title}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center space-x-2',
        align === 'center' && 'justify-center text-center',
        align === 'right' && 'justify-end text-right',
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              '-ml-3 h-8 data-[state=open]:bg-accent',
              align === 'center' && 'flex justify-center text-center',
              align === 'right' && 'flex justify-end text-right'
            )}
          >
            <span className="whitespace-nowrap">{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <SortDesc className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <SortAsc className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              if (
                currentSortBy === column.id &&
                currentSortDirection === 'asc'
              ) {
                deleteSort()
              } else {
                setSort(false)
              }
            }}
            className="flex"
          >
            <SortAsc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="flex-1">Asc</span>
            {currentSortBy === column.id && currentSortDirection === 'asc' && (
              <>
                <span className="sr-only">(current)</span>
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (
                currentSortBy === column.id &&
                currentSortDirection === 'desc'
              ) {
                deleteSort()
              } else {
                setSort(true)
              }
            }}
            className="flex"
          >
            <SortDesc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="flex-1">Desc</span>
            {currentSortBy === column.id && currentSortDirection === 'desc' && (
              <>
                <span className="sr-only">(current)</span>
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
