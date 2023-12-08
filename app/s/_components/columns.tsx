'use client'

import ColumnHeader from '@/components/ui/data-table/column-header'
import CopyCell from '@/components/ui/data-table/copy-cell'
import DateCell from '@/components/ui/data-table/date-cell'
import { RouterOutputs } from '@/trpc/shared'
import { ColumnDef } from '@tanstack/react-table'
import ReceiptTableActions from './table-actions'

type RowDataType = RouterOutputs['receipts']['getReceipts']['items'][number]

const receiptColumns: ColumnDef<RowDataType>[] = [
  {
    id: 'merchant',
    accessorKey: 'merchant',
    header: ({ column }) => <ColumnHeader column={column} title="Merchant" />,
    cell: ({ row }) => <CopyCell>{row.original.merchant}</CopyCell>,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => row.original.description,
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <ColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => <DateCell date={row.original.updatedAt} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ReceiptTableActions row={row.original} />,
  },
]

export default receiptColumns
