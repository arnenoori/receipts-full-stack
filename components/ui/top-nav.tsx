import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { Button } from './button'

export default async function TopNav({
  children,
  className,
  breadCrumbs,
}: {
  children?: React.ReactNode
  className?: string
  breadCrumbs?: Array<{
    href?: string
    label: string
  }>
}) {
  return (
    <div
      className={cn(
        'border-b px-5 py-2 flex gap-4 justify-between items-center w-full h-[52px]',
        className
      )}
    >
      {breadCrumbs && breadCrumbs.length > 0 && (
        <div className="text-muted-foreground flex gap-2 items-center">
          {breadCrumbs.map((breadCrumb, index) => (
            <Fragment key={`breadcrumb-${index}`}>
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {breadCrumb.href ? (
                <Link href={breadCrumb.href}>
                  <Button variant={'ghost'} size={'sm'}>
                    {breadCrumb.label}
                  </Button>
                </Link>
              ) : (
                <Button variant={'ghost'} size={'sm'}>
                  {breadCrumb.label}
                </Button>
              )}
            </Fragment>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}
