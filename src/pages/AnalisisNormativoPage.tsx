import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NoticeBanner } from '@/components/NoticeBanner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { useNotice } from '@/hooks/useNotice'
import { Landmark, Layers, Map, Ruler, Trees } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function AnalisisNormativoPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const base = `/p/${projectId ?? ''}`
  const { notice, showSuccess, showError, clear } = useNotice()
  const { metrics, normativo, setNormativo, loading, error } = useProjectWorkspace()
  const gate = metrics.overallProgress >= 72

  if (loading && !normativo && !error) {
    return <p className="text-sm text-muted-foreground">Cargando análisis normativo…</p>
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  const pot = normativo?.pot_cumplimiento_pct ?? 0

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 4 · Análisis normativo
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">POT y determinantes</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Los indicadores se guardan en la tabla <code className="rounded bg-muted px-1">project_normativo_metrics</code>.
          </p>
        </div>
        <Badge variant={gate ? 'success' : 'secondary'} className="w-fit">
          {gate ? 'Avance documental alto' : 'Consolidando insumos'}
        </Badge>
      </div>

      <Button asChild variant="secondary" className="gap-2 rounded-xl">
        <Link to={`${base}/entregables/fase2_viabilidad`}>
          <Layers className="h-4 w-4" />
          Taller · Informe Fase 2 (recomendaciones)
        </Link>
      </Button>

      {!normativo ? (
        <p className="text-sm text-destructive">
          No se encontraron métricas normativas. Verifique que el trigger de creación de proyecto
          ejecutó <code className="rounded bg-muted px-1">_seed_project_modules</code>.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="h-4 w-4 text-accent" />
              Indicadores editables
            </CardTitle>
            <CardDescription>Guarde con el botón tras editar.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cumplimiento POT (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                key={`pot-${normativo.updated_at}`}
                defaultValue={pot}
                id="pot-pct"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Nota Acuerdo 0250 / 2025</Label>
              <Input
                key={`ac-${normativo.updated_at}`}
                defaultValue={normativo.acuerdo_0250_note}
                id="ac-note"
              />
            </div>
            <div className="space-y-2">
              <Label>IOC</Label>
              <Input key={`ioc-${normativo.updated_at}`} defaultValue={normativo.ioc_label} id="ioc" />
            </div>
            <div className="space-y-2">
              <Label>IC</Label>
              <Input key={`ic-${normativo.updated_at}`} defaultValue={normativo.ic_label} id="ic" />
            </div>
            <div className="space-y-2">
              <Label>Densidad</Label>
              <Input
                key={`den-${normativo.updated_at}`}
                defaultValue={normativo.densidad_label}
                id="den"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                className="rounded-xl"
                onClick={async () => {
                  clear()
                  const potVal = Number(
                    (document.getElementById('pot-pct') as HTMLInputElement)?.value ?? pot,
                  )
                  const ac = (document.getElementById('ac-note') as HTMLInputElement)?.value ?? ''
                  const ioc = (document.getElementById('ioc') as HTMLInputElement)?.value ?? ''
                  const ic = (document.getElementById('ic') as HTMLInputElement)?.value ?? ''
                  const den = (document.getElementById('den') as HTMLInputElement)?.value ?? ''
                  const { error: err } = await setNormativo({
                    pot_cumplimiento_pct: Number.isFinite(potVal) ? Math.min(100, Math.max(0, potVal)) : 0,
                    acuerdo_0250_note: ac,
                    ioc_label: ioc,
                    ic_label: ic,
                    densidad_label: den,
                  })
                  if (err) showError(err)
                  else showSuccess('Métricas normativas guardadas correctamente.')
                }}
              >
                Guardar métricas
              </Button>
            </div>
            <div className="md:col-span-2">
              <Progress value={pot} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Map className="h-4 w-4 text-accent" />
              Uso del suelo
            </CardTitle>
            <CardDescription>Análisis cualitativo basado en POT y ficha normativa cargada.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Verifique en recolección los ítems de normativa específica del predio.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trees className="h-4 w-4 text-accent" />
              Ambiental
            </CardTitle>
            <CardDescription>Determinantes y estudios técnicos asociados.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Documentación de estudios debe adjuntarse en recolección o en anexos del proyecto.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Ruler className="h-4 w-4 text-accent" />
            Índices urbanísticos
          </CardTitle>
          <CardDescription>Etiquetas IOC / IC / densidad editables arriba.</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator />
          <p className="mt-4 text-sm text-muted-foreground">
            NSR-10 y disponibilidad de servicios se documentan en radicación y recolección.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
