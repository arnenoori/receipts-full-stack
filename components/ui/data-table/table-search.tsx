'use client'

import { TableSearchParamsKeys } from '@/lib/paths'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { SearchInput } from '../input'

export default function TableSearch({
  placeholder,
  className,
}: {
  placeholder: string
  className?: string
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(TableSearchParamsKeys.Page, (1).toString())

    if (term) {
      params.set(TableSearchParamsKeys.Query, term)
    } else {
      params.delete(TableSearchParamsKeys.Query)
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <SearchInput
      placeholder={placeholder}
      className={className}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query')?.toString()}
    />
  )
}
