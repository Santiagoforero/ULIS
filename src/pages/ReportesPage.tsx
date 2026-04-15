import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useUlis } from '@/context/UlisContext'
import { PROJECT } from '@/lib/projectMeta'
import { Download, FileSpreadsheet, RefreshCcw, Shield } from 'lucide-react'
import { useCallback, useState } from 'react'

export function ReportesPage() {
  const { metrics, resetWorkspace } = useUlis()
  const [toast, setToast] = useState<string | null>(null)

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  return (
    <div className="space-y-8">
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-border bg-sidebar px-4 py-3 text-sm text-sidebar-foreground shadow-xl">
          {toast}
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Módulo 8 · Reportes
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Inteligencia ejecutiva y exportaciones
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Paneles para junta directiva, cliente y contraparte técnica. Las exportaciones son
          simuladas pero reflejan el tipo de entregables que acompañan una consultoría de
          alto nivel.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Resumen instantáneo</CardTitle>
            <CardDescription>
              Indicadores derivados del estado actual del workspace ULIS.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">Progreso general</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">
                {metrics.overallProgress}%
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">MCN</p>
              <p className="mt-2 text-lg font-semibold">
                {metrics.collectionComplete ? 'Activa' : 'Bloqueada'}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">Riesgo jurídico</p>
              <p className="mt-2 text-lg font-semibold capitalize">{metrics.legalRisk}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exportaciones</CardTitle>
            <CardDescription>Generación controlada de paquetes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start gap-2 rounded-xl"
              variant="secondary"
              onClick={() => notify('Paquete PDF de expediente encolado (simulación).')}
            >
              <Download className="h-4 w-4" />
              Informe ejecutivo PDF
            </Button>
            <Button
              className="w-full justify-start gap-2 rounded-xl"
              variant="secondary"
              onClick={() =>
                notify('Hoja de cálculo MCN / checklist exportada (simulación).')
              }
            >
              <FileSpreadsheet className="h-4 w-4" />
              Matriz MCN · Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-accent" />
            Memorando de encargo (referencia contractual)
          </CardTitle>
          <CardDescription>
            Datos tomados de la propuesta técnica–económica de consultoría presentada a{' '}
            {PROJECT.client}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Honorarios referenciales:{' '}
            <span className="font-semibold text-foreground">{PROJECT.referenceFeeCOP}</span>{' '}
            con esquema de pagos 50% / 25% / 25% por etapas (inicio, radicación en debida
            forma, entrega de licencia).
          </p>
          <p>
            La consultoría incluye conceptos jurídicos vinculantes, MCN, estudio de títulos y
            plan de contingencia jurídica, según el alcance acordado en la propuesta con fecha{' '}
            {PROJECT.proposalRefDate}.
          </p>
          <Separator />
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">Auditable</Badge>
            <Badge variant="outline">Trazable</Badge>
            <Badge variant="outline">Listo para data room</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Herramientas de demostración</CardTitle>
          <CardDescription>
            Restablece el workspace a los valores semilla del expediente Cañaveral – Península.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={() => {
              resetWorkspace()
              notify('Workspace reiniciado a datos semilla.')
            }}
          >
            <RefreshCcw className="h-4 w-4" />
            Reiniciar expediente demo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
