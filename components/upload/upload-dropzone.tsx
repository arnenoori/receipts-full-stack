'use client'

import type { FileWithPath } from '@uploadthing/react'
import { useDropzone } from '@uploadthing/react/hooks'
import {
  allowedContentTextLabelGenerator,
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from 'uploadthing/client'

import { useUploadThing } from '@/lib/uploadthing'
import { cn, truncate } from '@/lib/utils'
import { OurFileRouter } from '@/server/uploadthing/core'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { ImageIcon, TrashIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { inferEndpointInput } from 'uploadthing/server'
import { Button } from '../ui/button'
import Spinner from '../ui/spinner'

type Options = Parameters<typeof useUploadThing>[1]

export function UploadDropzone<T extends keyof OurFileRouter>(props: {
  endpoint: T
  input: inferEndpointInput<OurFileRouter[T]>
  options: Options
}) {
  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    props.endpoint,
    props.options
  )

  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { fileTypes } = generatePermittedFileTypes(permittedFileInfo?.config)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  })

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          'mt-2 w-full flex justify-center rounded-lg border border-dashed border-gray-900/25 w-full dark:border-gray-700',
          isDragActive && 'bg-blue-600/10 transition-colors duration-200'
        )}
      >
        <div
          className="px-6 py-8 w-full text-center flex flex-col items-center gap-4"
          {...getRootProps()}
        >
          <CloudArrowUpIcon className="w-7 h-7 mb-3" />
          <p className="font-semibold text-sm">
            Choose a file or drag & drop it here.
          </p>
          <p className="text-xs text-muted-foreground">
            {allowedContentTextLabelGenerator(permittedFileInfo?.config)}
          </p>
          {files.length > 0 ? (
            <>
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2 mt-3 hover:line-through hover:cursor-pointer hover:text-destructive group"
                  onClick={() =>
                    setFiles(files.filter((f) => f.name !== file.name))
                  }
                >
                  <ImageIcon className="w-5 text-success h-5 group-hover:text-destructive" />
                  {truncate(file.name, 30)}
                  <button>
                    <TrashIcon
                      className="w-5 h-5 text-muted-foreground group-hover:text-destructive"
                      aria-label="Remove file"
                    />
                  </button>
                </div>
              ))}
            </>
          ) : (
            <Button
              variant={'outline'}
              className={cn('mt-3', isDragActive && 'bg-transparent')}
              size={'sm'}
            >
              {!isDragActive ? `Browse File` : `Drop File`}
              <input className="sr-only" {...getInputProps()} />
            </Button>
          )}
        </div>
      </div>
      {files.length > 0 && (
        <Button
          className="w-full"
          disabled={isUploading}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!files) return

            // TODO: fix this
            // ignore the type error here, it's fine
            // @ts-ignore
            void startUpload(files, props.input)
          }}
        >
          {isUploading ? (
            <>
              <Spinner className="mr-2" />
              Uploading...
            </>
          ) : (
            `Upload ${files.length} file${files.length === 1 ? '' : 's'}`
          )}
        </Button>
      )}
    </div>
  )
}
