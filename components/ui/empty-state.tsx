import { cn } from '@/lib/utils'

export default async function EmptyState({
  icon,
  className,
  title,
  details,
  children,
}: {
  icon: React.ReactNode
  title: string
  details: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'w-full h-full p-10 flex-col border border-dashed rounded flex justify-center items-center gap-2',
        className
      )}
    >
      <div className="border rounded items-center justify-center flex w-20 h-20">
        {icon}
      </div>
      <h3 className="text-lg mt-4 font-semibold">{title}</h3>
      <p className="text-muted-foreground">{details}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
