import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, type ReactNode } from 'react'

type Props = {
  triggerLabel: string
  leadingIcon?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
  className?: string
  busy?: boolean
  onConfirm: () => void | Promise<void>
  'aria-label'?: string
}

export function InlineConfirm({
  triggerLabel,
  leadingIcon,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'outline',
  size = 'sm',
  className,
  busy,
  onConfirm,
  'aria-label': ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  if (!open) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn('inline-flex items-center justify-center gap-2', className)}
        disabled={busy}
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
      >
        {leadingIcon ? <span className="inline-flex shrink-0">{leadingIcon}</span> : null}
        {triggerLabel}
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">¿Seguro?</span>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() => setOpen(false)}
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={async () => {
          setPending(true)
          try {
            await onConfirm()
            setOpen(false)
          } catch {
            /* mantener panel abierto; el padre ya mostró el error */
          } finally {
            setPending(false)
          }
        }}
      >
        {pending ? '…' : confirmLabel}
      </Button>
    </div>
  )
}
