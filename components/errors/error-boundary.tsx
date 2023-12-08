'use client'

// Error components must be Client Components
import { FileStackIcon, FrownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TRPCError } from '@trpc/server'
import NotFoundError from './not-found-error'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const NOT_FOUND_LOOKUP = 'trpcNotFoundError'

  if (
    error instanceof TRPCError ||
    (error.stack && error.stack.includes(NOT_FOUND_LOOKUP)) ||
    error.message.includes('not found')
  ) {
    return <NotFoundError message={error.message} />
  }

  return (
    <div className="py-5">
      <div
        className={cn(
          'mx-auto flex max-w-2xl flex-col gap-4 rounded py-10 text-center text-destructive-foreground',
          'bg-background text-destructive'
        )}
      >
        <FrownIcon className="mx-auto h-12 w-12" />
        <h2 className="font-semibold">Something went wrong!</h2>
        <h2>
          If this issue persists, please reach out to info@receipts.ai and we
          will fix it ASAP
        </h2>
        <Button
          variant={'destructive'}
          className="mx-auto"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button
          variant={'link'}
          className="mx-auto"
          size={'sm'}
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => setShowError(!showError)
          }
        >
          {showError ? 'Hide stack trace' : 'Show stack trace'}
          <FileStackIcon className="ml-2 h-4 w-4" />
        </Button>
        {showError && (
          <div className="max-w-full text-left">
            <h2 className="font-semibold">Error</h2>
            <pre className="overflow-x-auto text-sm">{error.stack}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
