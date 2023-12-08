import { PublicPath, buildPath } from '@/lib/paths'
import { cn } from '@/lib/utils'
import { DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function Logo({
  withText = true,
  className,
  size,
  path,
  withLink = true,
}: {
  className?: string
  withText?: boolean
  size?: 'lg'
  path?: string
  withLink?: boolean
}) {
  const content = (
    <>
      <span
        className={cn(
          'rounded-sm bg-foreground text-background flex items-center justify-center',
          size === 'lg' ? 'h-12 w-12' : 'w-8 h-8'
        )}
      >
        <DollarSign
          className={cn(
            'text-background',
            size === 'lg' ? 'h-10 w-10' : 'h-7 w-7'
          )}
        />
      </span>
      {withText && <span className="font-medium">Receipts</span>}
    </>
  )

  if (!withLink)
    return (
      <div className={cn('flex items-center gap-3', className)}>{content}</div>
    )

  return (
    <Link
      href={path ?? buildPath({ path: PublicPath.Home })}
      className={cn('flex items-center gap-3', className)}
    >
      {content}
    </Link>
  )
}
