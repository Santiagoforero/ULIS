import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import {
  computeDeliverableProgress,
  getWorksheetState,
  parseDeliverablesMetadata,
} from '@/lib/deliverableMetadata'
import { deliverables } from '@/lib/deliverablesRegistry'
import { ArrowRight, Layers } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function EntregablesHubPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { project } = useProjectWorkspace()
  const base = `/p/${projectId ?? ''}`

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Taller de entregables
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Bases didácticas por entregable contractual
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Cada tarjeta enlaza a un espacio con metodología, plantillas tabulares editables, notas y
          carga del documento final. Los módulos (MCN, radicación, etc.) siguen siendo la fuente
          operativa cuando aplica.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {deliverables.map((def) => {
          const sheet = getWorksheetState(project?.metadata ?? null, def)
          const files = parseDeliverablesMetadata(project?.metadata).deliverable_final_files?.[def.id]
          const pct = computeDeliverableProgress(def, sheet, files)
          return (
            <Link key={def.id} to={`${base}/entregables/${def.id}`} className="group block h-full">
              <Card className="h-full border-border/80 transition hover:border-accent/40 hover:shadow-md">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="rounded-lg text-[10px]">
                      {def.phaseLabel}
                    </Badge>
                    <Layers className="h-4 w-4 text-muted-foreground opacity-60 transition group-hover:text-accent" />
                  </div>
                  <CardTitle className="text-base leading-snug">{def.shortLabel}</CardTitle>
                  <CardDescription className="line-clamp-2">{def.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="h-1.5 flex-1" />
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Abrir taller
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
