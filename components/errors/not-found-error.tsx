import { Button } from '@/components/ui/button'
import { PrivatePath, buildPath } from '@/lib/paths'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function NotFoundError({
  message = 'Could not find the requested data.',
}: {
  message?: string
}) {
  return (
    <main className="flex h-full flex-col items-center justify-start gap-4 mt-20">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>{message}</p>
      <Link
        href={buildPath({
          path: PrivatePath.Home,
        })}
      >
        <Button>Go Back</Button>
      </Link>
    </main>
  )
}
