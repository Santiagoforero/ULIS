import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useUlis } from '@/context/UlisContext'
import { DOCUMENT_SECTIONS } from '@/data/documentCatalog'
import { PROJECT } from '@/lib/projectMeta'
import type { DocStatus } from '@/types'
import { ClipboardList, Layers, UploadCloud } from 'lucide-react'

function statusBadge(status: DocStatus) {
  if (status === 'pending')
    return <Badge variant="destructive">Pendiente</Badge>
  if (status === 'review')
    return <Badge variant="warning">En revisión</Badge>
  return <Badge variant="success">Completo</Badge>
}

function sectionProgress(
  sectionId: string,
  states: Record<string, { status: DocStatus }>,
) {
  const section = DOCUMENT_SECTIONS.find((s) => s.id === sectionId)
  if (!section) return 0
  const total = section.documents.length
  const done = section.documents.filter((d) => states[d.id]?.status === 'complete').length
  return Math.round((done / total) * 1000) / 10
}

export function DocumentCollectionPage() {
  const { docStates, metrics, setDocStatus, setObservations, simulateUpload } = useUlis()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Checklist Mardel – Legal
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Recolección documental
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Núcleo operativo de ULIS: control granular de cada insumo registral, catastral y
            normativo que alimenta el estudio de títulos, la due diligence inmobiliaria y la
            futura MCN frente al POT de Floridablanca, Decreto 068 de 2016, Acuerdo 0250 de
            2025, Decreto 1077 de 2015 y Ley 388 de 1997.
          </p>
        </div>
        <Card className="w-full max-w-md border-accent/25 bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-accent" />
              Progreso del módulo
            </CardTitle>
            <CardDescription>
              Avance total ponderado por ítems en estado{' '}
              <span className="font-semibold text-foreground">Completo</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">Expediente</span>
              <span className="text-lg font-semibold tabular-nums">
                {metrics.overallProgress}%
              </span>
            </div>
            <Progress value={metrics.overallProgress} className="h-2.5" />
            <p className="text-xs text-muted-foreground">
              {metrics.complete} de {metrics.total} documentos cerrados a satisfacción del
              equipo técnico–jurídico.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cliente y objeto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-semibold">{PROJECT.client}</p>
            <p className="text-muted-foreground">Att: {PROJECT.clientContact}</p>
            <Separator className="my-3" />
            <p className="font-medium">{PROJECT.name}</p>
            <p className="text-xs text-muted-foreground">{PROJECT.address}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flujo de carga
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Cada carga simula el radicado interno de soporte PDF/ DWG/ XLSX con hash lógico
              y marca de tiempo ISO para trazabilidad.
            </p>
            <p className="text-xs">
              Tras la carga, el ítem pasa automáticamente a{' '}
              <span className="font-semibold text-foreground">En revisión</span> hasta
              cierre en <span className="font-semibold text-foreground">Completo</span>.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disciplina documental
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Las observaciones quedan asociadas al ítem y son exportables en el módulo de
              Reportes para minutas de reunión y instructivos al cliente.
            </p>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="max-h-[none]">
        <div className="space-y-6 pb-10">
          {DOCUMENT_SECTIONS.map((section) => {
            const pct = sectionProgress(section.id, docStates)
            return (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader className="border-b border-border/80 bg-muted/30">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-accent" />
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                    <div className="w-full max-w-xs space-y-2 sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Progreso de sección
                      </p>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <Progress value={pct} className="h-2 w-40 sm:w-44" />
                        <span className="text-sm font-semibold tabular-nums">{pct}%</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="divide-y divide-border/80 p-0">
                  {section.documents.map((doc) => {
                    const state = docStates[doc.id]
                    if (!state) return null
                    return (
                      <div key={doc.id} className="space-y-4 px-4 py-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {statusBadge(state.status)}
                              <span className="text-[11px] font-mono text-muted-foreground">
                                ID · {doc.id}
                              </span>
                            </div>
                            <p className="text-sm font-semibold leading-snug">{doc.title}</p>
                            {doc.subtitle ? (
                              <p className="text-xs text-muted-foreground">{doc.subtitle}</p>
                            ) : null}
                            {state.fileName ? (
                              <p className="text-xs text-muted-foreground">
                                Último archivo:{' '}
                                <span className="font-mono text-foreground">
                                  {state.fileName}
                                </span>
                                {state.uploadedAt ? (
                                  <>
                                    {' '}
                                    ·{' '}
                                    <span className="font-mono">
                                      {new Date(state.uploadedAt).toLocaleString('es-CO')}
                                    </span>
                                  </>
                                ) : null}
                              </p>
                            ) : (
                              <p className="text-xs text-amber-800/90">
                                Sin archivo registrado en el repositorio ULIS.
                              </p>
                            )}
                          </div>

                          <div className="flex w-full flex-col gap-3 lg:w-72">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Estado del ítem
                              </Label>
                              <Select
                                value={state.status}
                                onValueChange={(v) => setDocStatus(doc.id, v as DocStatus)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="review">En revisión</SelectItem>
                                  <SelectItem value="complete">Completo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              className="w-full gap-2 rounded-xl"
                              onClick={() => simulateUpload(doc.id)}
                            >
                              <UploadCloud className="h-4 w-4" />
                              Subir archivo (simulado)
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Observaciones del equipo
                          </Label>
                          <Textarea
                            value={state.observations}
                            onChange={(e) => setObservations(doc.id, e.target.value)}
                            placeholder="Notas de rigor jurídico, inconsistencias detectadas, solicitudes al cliente…"
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
