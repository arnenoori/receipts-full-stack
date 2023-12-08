'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { startsWithVowel } from '@/lib/utils'
import { OurFileRouter } from '@/server/uploadthing/core'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { inferEndpointInput } from 'uploadthing/server'
import { useToast } from '../ui/use-toast'
import { UploadDropzone } from './upload-dropzone'

export default function UploadDialog<T extends keyof OurFileRouter>({
  title,
  endpoint,
  input,
  children,
}: {
  endpoint: T
  input: inferEndpointInput<OurFileRouter[T]>
  title: string
  children: React.ReactNode
}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex gap-3 items-center flex-row">
          <div className="border rounded-full h-10 w-10 items-center justify-center flex">
            <CloudArrowUpIcon className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>Upload a file</DialogTitle>
            <DialogDescription>
              Select and upload a{startsWithVowel(title) ? 'n' : ''}{' '}
              {title.toLowerCase()}.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <UploadDropzone
            endpoint={endpoint}
            input={input}
            options={{
              onUploadError: (err) => {
                toast({
                  title: 'Upload error',
                  description: err.message,
                  variant: 'destructive',
                })
              },
              onClientUploadComplete: (res) => {
                toast({
                  title: 'Upload complete',
                  description: `Your ${title.toLowerCase()} has been uploaded.`,
                  variant: 'success',
                })
                setOpen(false)

                router.refresh()
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
