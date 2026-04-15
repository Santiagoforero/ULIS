import { cn } from '@/lib/utils'

type Props = {
  label?: string
  className?: string
}

export function IndeterminateProgress({ label, className }: Props) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? <p className="text-xs text-muted-foreground">{label}</p> : null}
      <div className="ulis-upload-track relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="ulis-upload-bar absolute inset-y-0 w-2/5 rounded-full bg-accent" />
      </div>
    </div>
  )
}
