import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InlineConfirm } from '@/components/InlineConfirm'
import { NoticeBanner } from '@/components/NoticeBanner'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { useNotice } from '@/hooks/useNotice'
import { BookMarked, GitBranch, Scale, ShieldAlert, Sparkles, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function DiagnosticoLegalPage() {
  const { notice, showSuccess, showError, clear } = useNotice()
  const { projectId } = useParams<{ projectId: string }>()
  const base = `/p/${projectId ?? ''}`
  const {
    metrics,
    diagRisks,
    addDiagRisk,
    updateDiagRisk,
    deleteDiagRisk,
    loading,
    error,
  } = useProjectWorkspace()
  const unlocked = metrics.collectionComplete

  if (loading && !diagRisks.length && !error) {
    return <p className="text-sm text-muted-foreground">Cargando diagnóstico…</p>
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  const chainPct = unlocked
    ? Math.min(100, Math.round((metrics.complete / Math.max(metrics.total, 1)) * 70 + 8))
    : Math.min(100, Math.round(metrics.loaded * 3))

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 3 · Diagnóstico legal
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Estudio de títulos y riesgos</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Riesgos jurídicos son filas en base de datos: créelos, edítelos o elimínelos. No hay
            cifras simuladas.
          </p>
        </div>
        <Badge variant={unlocked ? 'success' : 'secondary'} className="w-fit">
          {unlocked ? 'Recolección completa' : 'Recolección en curso'}
        </Badge>
      </div>

      {!unlocked ? (
        <Card className="border-dashed border-amber-500/40 bg-amber-50/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-950">
              <ShieldAlert className="h-4 w-4" />
              Secuencia metodológica
            </CardTitle>
            <CardDescription className="text-amber-950/80">
              Avance documental actual: {metrics.overallProgress}%.{' '}
              <Link className="font-semibold text-accent underline-offset-4 hover:underline" to={`${base}/recoleccion`}>
                Recolección documental
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="h-4 w-4 text-accent" />
              Estudio de títulos
            </CardTitle>
            <CardDescription>
              Indicador de avance de cadena basado en documentos completos y archivos cargados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Documentos completos: {metrics.complete} / {metrics.total}. Archivos en storage:{' '}
              {metrics.loaded}.
            </p>
            <Separator />
            <Progress value={chainPct} className="h-2.5" />
            <p className="text-xs">Avance referencial de línea dominial: {chainPct}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-4 w-4 text-accent" />
              Validación 30 años
            </CardTitle>
            <CardDescription>Consistencia con insumos de escrituras en expediente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={chainPct} className="h-2.5" />
            <p className="text-xs text-muted-foreground">
              Complete y cargue las escrituras y el CTL en recolección para acercar este indicador
              al 100%.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              Riesgos jurídicos
            </CardTitle>
            
          </div>
          <Button
            type="button"
            className="rounded-xl"
            onClick={async () => {
              clear()
              const { error: err } = await addDiagRisk()
              if (err) showError(err)
              else showSuccess('Riesgo añadido al diagnóstico.')
            }}
          >
            Añadir riesgo
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {diagRisks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay riesgos registrados. Use «Añadir riesgo» para documentar hallazgos.
            </p>
          ) : (
            <ul className="space-y-4">
              {diagRisks.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Input
                      key={`t-${r.id}-${r.updated_at}`}
                      defaultValue={r.title}
                      onBlur={async (e) => {
                        const { error: err } = await updateDiagRisk(r.id, { title: e.target.value })
                        if (err) {
                          clear()
                          showError(err)
                        }
                      }}
                      placeholder="Título"
                    />
                    <Input
                      key={`l-${r.id}-${r.updated_at}`}
                      defaultValue={r.level_label}
                      onBlur={async (e) => {
                        const { error: err } = await updateDiagRisk(r.id, {
                          level_label: e.target.value,
                        })
                        if (err) {
                          clear()
                          showError(err)
                        }
                      }}
                      placeholder="Nivel (Bajo/Medio/Alto)"
                    />
                    <InlineConfirm
                      triggerLabel="Eliminar"
                      leadingIcon={<Trash2 className="h-4 w-4" />}
                      confirmLabel="Sí, eliminar"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onConfirm={async () => {
                        clear()
                        const { error: err } = await deleteDiagRisk(r.id)
                        if (err) {
                          showError(err)
                          return Promise.reject()
                        }
                        showSuccess('Riesgo eliminado.')
                      }}
                    />
                  </div>
                  <Input
                    key={`d-${r.id}-${r.updated_at}`}
                    defaultValue={r.detail}
                    onBlur={async (e) => {
                      const { error: err } = await updateDiagRisk(r.id, { detail: e.target.value })
                      if (err) {
                        clear()
                        showError(err)
                      }
                    }}
                    placeholder="Detalle"
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookMarked className="h-4 w-4 text-accent" />
              Entregables jurídicos
            </CardTitle>
            <CardDescription>Según propuesta contractual (gestión documental externa).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>· Concepto jurídico de viabilidad vinculante.</p>
            <p>· Informe de due diligence inmobiliaria integral.</p>
            <p>· Estudio de títulos.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-accent" />
              Próximo paso
            </CardTitle>
            <CardDescription>Análisis normativo y MCN con datos reales del proyecto.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Cuando cierre la recolección, avance al{' '}
              <Link className="font-medium text-accent underline-offset-4 hover:underline" to={`${base}/analisis-normativo`}>
                análisis normativo
              </Link>{' '}
              y a la{' '}
              <Link className="font-medium text-accent underline-offset-4 hover:underline" to={`${base}/mcn`}>
                MCN
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
