import { MoreHorizontal, TrashIcon, ViewIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Spinner from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { ReceiptPath, buildPath } from '@/lib/paths'
import { api } from '@/trpc/react'
import { RouterOutputs } from '@/trpc/shared'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type RowDataType = RouterOutputs['receipts']['getReceipts']['items'][number]

type Props = {
  row: RowDataType
}

export default function ReceiptTableActions({ row }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const deleteMutation = api.receipts.hardDeleteReceipt.useMutation()
  const handleDelete = async () => {
    deleteMutation.mutate(
      {
        receiptId: row.id,
      },
      {
        onSuccess: () => {
          toast({
            status: 'success',
            description: 'Receipt deleted',
          })

          router.refresh()
          setDialogOpen(false)
        },
        onError: (err) => {
          toast({
            status: 'error',
            description: err.message,
          })
        },
      }
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="max-w-8 h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link
            href={buildPath({
              path: ReceiptPath.Home,
              params: {
                receiptId: row.id,
              },
            })}
          >
            <DropdownMenuItem>
              <ViewIcon className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
          </Link>
          <DialogTrigger className="w-full">
            <DropdownMenuItem>
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete receipt</DialogTitle>
          <DialogDescription className="text-md pt-2">
            This action cannot be undone. Are you sure you want to permanently
            delete this receipt from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            disabled={deleteMutation.isLoading}
            onClick={handleDelete}
          >
            Delete
            {deleteMutation.isLoading && <Spinner className="ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
