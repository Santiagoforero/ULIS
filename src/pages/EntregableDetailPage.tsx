import { DeliverableWorkshop } from '@/components/DeliverableWorkshop'
import { Button } from '@/components/ui/button'
import { deliverablesById, isDeliverableId } from '@/lib/deliverablesRegistry'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function EntregableDetailPage() {
  const { projectId, deliverableId = '' } = useParams<{ projectId: string; deliverableId: string }>()
  const base = `/p/${projectId ?? ''}`

  if (!isDeliverableId(deliverableId)) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Entregable no reconocido.</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to={`${base}/entregables`}>Volver al listado</Link>
        </Button>
      </div>
    )
  }

  const def = deliverablesById[deliverableId]

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="gap-2 rounded-xl px-0 text-muted-foreground hover:text-foreground">
        <Link to={`${base}/entregables`}>
          <ArrowLeft className="h-4 w-4" />
          Todos los entregables
        </Link>
      </Button>
      <DeliverableWorkshop def={def} basePath={base} />
    </div>
  )
}
