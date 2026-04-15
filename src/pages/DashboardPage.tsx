import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { metaStrings } from '@/lib/metadata'
import { PHASES } from '@/lib/projectMeta'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  FileStack,
  Shield,
  Timer,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

function riskVariant(level: string) {
  if (level === 'alto') return 'destructive' as const
  if (level === 'medio') return 'warning' as const
  return 'success' as const
}

function riskLabel(level: string) {
  if (level === 'alto') return 'Alto'
  if (level === 'medio') return 'Medio'
  return 'Bajo'
}

export function DashboardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { project, metrics, loading, error } = useProjectWorkspace()
  const base = `/p/${projectId ?? ''}`
  const meta = project ? metaStrings(project.metadata) : {}

  const statusPieData = [
    { name: 'Completo', value: metrics.complete, fill: 'oklch(0.62 0.17 145)' },
    { name: 'En revisión', value: metrics.review, fill: 'oklch(0.78 0.15 85)' },
    { name: 'Pendiente', value: metrics.pending, fill: 'oklch(0.58 0.22 25)' },
  ].filter((d) => d.value > 0)

  if (loading && !project) {
    return <p className="text-sm text-muted-foreground">Cargando dashboard…</p>
  }
  if (error || !project) {
    return <p className="text-sm text-destructive">{error ?? 'Sin proyecto.'}</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Urban Legal Intelligence System
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Centro de mando del expediente
          </h2>
          
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={riskVariant(metrics.legalRisk)} className="px-3 py-1 text-xs">
            Riesgo jurídico estimado: {riskLabel(metrics.legalRisk)}
          </Badge>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to={`${base}/propuesta`}>
              Propuesta contractual
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-xl">
            <Link to={`${base}/recoleccion`}>
              Ir a recolección
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribución documental por estado</CardTitle>
          <CardDescription>Datos en vivo desde Supabase (estados del checklist documental).</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {statusPieData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay documentos en el expediente.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Proyecto</CardTitle>
            <CardDescription>
              Cliente: <span className="font-medium text-foreground">{project.client_name ?? '—'}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Denominación
                </p>
                <p className="mt-1 text-lg font-semibold">{project.name}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {[project.address, project.municipality, project.department].filter(Boolean).join(' · ') || '—'}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Estado del servicio
                </p>
                <p className="mt-1 text-lg font-semibold">{project.macro_state ?? '—'}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Fase:{' '}
                  <span className="font-semibold text-foreground">{project.phase_label ?? '—'}</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-muted-foreground">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p>
                  La matriz de cumplimiento normativo se activa una vez se complete el{' '}
                  <span className="font-semibold text-foreground">100%</span> de la recolección
                  documental (todos los ítems en estado Completo en base de datos).
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Progreso general</span>
                <span className="tabular-nums text-muted-foreground">{metrics.overallProgress}%</span>
              </div>
              <Progress value={metrics.overallProgress} className="h-2.5" />
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold">Antecedente urbanístico (metadata)</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Licencia subdivisión{' '}
                <span className="font-mono text-foreground">
                  {meta.subdivision_license ?? '—'}
                </span>{' '}
                · {meta.subdivision_authority ?? '—'} · {meta.subdivision_date ?? '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileStack className="h-4 w-4 text-accent" />
              KPIs documentales
            </CardTitle>
            <CardDescription>Calculados en vivo desde la tabla de documentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs text-muted-foreground">Requeridos</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{metrics.total}</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs text-muted-foreground">Con archivo</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{metrics.loaded}</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
                  {metrics.pending}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs text-muted-foreground">En revisión</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-[oklch(0.35_0.08_75)]">
                  {metrics.review}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Timer className="h-3.5 w-3.5" />
                Horizonte contractual (referencia en metadata)
              </p>
              <p className="mt-2 leading-relaxed">
                Honorarios referencia: {meta.reference_fee_cop ?? '—'} · Fecha propuesta:{' '}
                {meta.proposal_ref_date ?? '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline del proyecto</CardTitle>
          <CardDescription>Metodología estructurada; la fase activa operativa es recolección.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PHASES.map((phase, idx) => {
              const active = phase.id === 'recoleccion'
              const done = phase.id === 'recoleccion' ? metrics.collectionComplete : false
              return (
                <li
                  key={phase.id}
                  className={`relative flex gap-3 rounded-2xl border p-4 text-sm transition ${
                    active
                      ? 'border-accent/40 bg-accent/5 shadow-sm'
                      : 'border-border bg-white/80'
                  }`}
                >
                  <div className="mt-0.5">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : active ? (
                      <CircleDot className="h-5 w-5 text-accent" />
                    ) : (
                      <CircleDot className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Etapa {idx + 1}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">{phase.label}</p>
                    {active ? (
                      <p className="mt-1 text-xs font-medium text-accent">ACTIVA</p>
                    ) : (
                      <Link
                        className="mt-1 inline-block text-xs text-accent underline-offset-4 hover:underline"
                        to={`${base}/${phase.route}`}
                      >
                        Abrir módulo
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Riesgos y control
            </CardTitle>
            <CardDescription>
              El semáforo se alimenta del avance documental real y de la carga en revisión.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Documentos completos: {metrics.complete}. Archivos en Storage: {metrics.loaded}.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Equipo director (metadata)</CardTitle>
           
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">{meta.consultant_name ?? '—'}</p>
            <p className="text-xs text-muted-foreground">{meta.consultant_role ?? ''}</p>
            <Separator className="my-3" />
            <p>
              <span className="text-muted-foreground">Teléfono:</span>{' '}
              <span className="font-mono">{meta.consultant_phone ?? '—'}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Correo:</span>{' '}
              {meta.consultant_email ? (
                <a
                  className="font-medium text-accent underline-offset-4 hover:underline"
                  href={`mailto:${meta.consultant_email}`}
                >
                  {meta.consultant_email}
                </a>
              ) : (
                '—'
              )}
            </p>
            <p>
              <span className="text-muted-foreground">Oficina:</span>{' '}
              {meta.consultant_address ?? '—'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
