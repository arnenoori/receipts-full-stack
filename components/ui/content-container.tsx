import { cn } from '@/lib/utils'

export default function ContentContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'md:max-w-screen-lg lg:max-w-screen-xl flex flex-col py-5 mx-auto px-5',
        className
      )}
    >
      {children}
    </div>
  )
}
