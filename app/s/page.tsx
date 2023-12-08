import { Button } from '@/components/ui/button'
import DataTable from '@/components/ui/data-table'
import DataTableLoading from '@/components/ui/data-table/loading'
import TableSearch from '@/components/ui/data-table/table-search'
import UploadDialog from '@/components/upload/upload-dialog'
import { PathToSearchParamsMap, PrivatePath } from '@/lib/paths'
import { api } from '@/trpc/server'
import { UploadIcon } from 'lucide-react'
import { Suspense } from 'react'
import receiptColumns from './_components/columns'

async function Table({
  searchParams,
}: {
  searchParams?: PathToSearchParamsMap[typeof PrivatePath.Home]
}) {
  const discoveries = await api.receipts.getReceipts.query({
    query: searchParams?.query,
    pageSize: Number(searchParams?.pageSize || 10),
    page: Number(searchParams?.page || 1),
    sortBy: searchParams?.sortBy,
    sortDirection: searchParams?.sortDirection,
  })

  return <DataTable columns={receiptColumns} data={discoveries} />
}

export default async function DiscoveriesPage({
  searchParams,
}: {
  searchParams?: PathToSearchParamsMap[typeof PrivatePath.Home]
}) {
  return (
    <>
      <div className="flex gap-2">
        <TableSearch placeholder="Search receipts..." className="flex-1" />
        <UploadDialog
          endpoint="imageUploader"
          title={'Upload receipt'}
          input={undefined}
        >
          <Button>
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload receipt
          </Button>
        </UploadDialog>
      </div>
      <Suspense fallback={<DataTableLoading columns={receiptColumns} />}>
        <Table searchParams={searchParams} />
      </Suspense>
    </>
  )
}
