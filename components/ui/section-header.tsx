import { cn } from '@/lib/utils'

export default function SectionHeader({
  children,
  title,
  subtitle,
  icon,
  titleClassName,
  className,
}: {
  children?: React.ReactNode
  title: string
  subtitle?: string
  icon?: React.ReactNode
  titleClassName?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      {icon}
      <div className="flex flex-1 flex-col">
        <h1 className={cn('flex items-center gap-2 text-xl', titleClassName)}>
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center justify-end gap-2">{children}</div>
      )}
    </div>
  )
}
