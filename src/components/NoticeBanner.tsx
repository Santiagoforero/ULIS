import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { NoticeState } from '@/hooks/useNotice'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

type Props = {
  notice: NoticeState
  onDismiss: () => void
  className?: string
}

export function NoticeBanner({ notice, onDismiss, className }: Props) {
  if (!notice) return null

  const styles =
    notice.type === 'success'
      ? 'border-success/30 bg-success/10 text-foreground'
      : notice.type === 'error'
        ? 'border-destructive/40 bg-destructive/10 text-foreground'
        : 'border-accent/30 bg-accent/5 text-foreground'

  const Icon =
    notice.type === 'success' ? CheckCircle2 : notice.type === 'error' ? AlertCircle : Info

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm',
        styles,
        className,
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          notice.type === 'success' && 'text-success',
          notice.type === 'error' && 'text-destructive',
          notice.type === 'info' && 'text-accent',
        )}
        aria-hidden
      />
      <p className="min-w-0 flex-1 leading-relaxed">{notice.message}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={onDismiss}
        aria-label="Cerrar aviso"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
