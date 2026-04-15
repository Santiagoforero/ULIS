import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { NoticeBanner } from '@/components/NoticeBanner'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { useNotice } from '@/hooks/useNotice'
import {
  methodologyBlocks,
  paymentSchedule,
  proposalChecklistItems,
  proposalMeta,
  timelineWeeks,
  type ProposalChecklistId,
} from '@/lib/proposalContent'
import type { Json } from '@/types/database'
import { ArrowRight, BookOpen, CheckCircle2, Circle, Table2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function readChecklist(metadata: Json | null): Record<string, boolean> {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return {}
  const raw = (metadata as Record<string, unknown>).proposal_checklist
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, boolean> = {}
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'boolean') out[k] = v
  }
  return out
}

export function ProposalPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { project, updateProject, loading, error } = useProjectWorkspace()
  const { notice, showSuccess, showError, clear } = useNotice()
  const base = `/p/${projectId ?? ''}`

  const [tab, setTab] = useState<'resumen' | 'entregables' | 'metodologia' | 'economico'>('resumen')

  const checklist = useMemo(
    () => readChecklist(project?.metadata ?? null),
    [project?.metadata],
  )

  const setCheck = useCallback(
    async (id: ProposalChecklistId, value: boolean) => {
      if (!project) return
      clear()
      const nextMeta = {
        ...(typeof project.metadata === 'object' && project.metadata && !Array.isArray(project.metadata)
          ? (project.metadata as Record<string, unknown>)
          : {}),
        proposal_checklist: {
          ...checklist,
          [id]: value,
        },
      }
      const { error: err } = await updateProject({ metadata: nextMeta as Json })
      if (err) showError(err)
      else showSuccess('Avance guardado en el expediente.')
    },
    [checklist, clear, project, showError, showSuccess, updateProject],
  )

  const chartData = useMemo(
    () => timelineWeeks.map((t) => ({ name: t.name.split('·')[1]?.trim() ?? t.name, semanas: t.weeks })),
    [],
  )

  const paymentChart = useMemo(
    () => paymentSchedule.map((p) => ({ name: `${p.pct}%`, valor: p.pct })),
    [],
  )

  if (loading && !project) {
    return <p className="text-sm text-muted-foreground">Cargando propuesta…</p>
  }
  if (error || !project) {
    return <p className="text-sm text-destructive">{error ?? 'Sin proyecto.'}</p>
  }

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}

      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-background to-muted/30 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Propuesta contractual
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{proposalMeta.project}</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Consultoría integral para análisis, evaluación y concepto técnico–jurídico orientado a la
              aprobación y desarrollo del proyecto. Use las pestañas para navegar el alcance, marcar
              entregables y vincular cada ítem con los módulos operativos de ULIS.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/80 px-4 py-3 text-sm shadow-sm">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Cliente</p>
            <p className="font-semibold">{proposalMeta.client}</p>
            <p className="mt-1 text-xs text-muted-foreground">Att: {proposalMeta.contactName}</p>
            <p className="mt-2 text-xs text-muted-foreground">{proposalMeta.proposalDate}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['resumen', 'Resumen'],
            ['entregables', 'Entregables'],
            ['metodologia', 'Metodología'],
            ['economico', 'Costos y tiempo'],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            variant={tab === id ? 'default' : 'outline'}
            className="rounded-xl"
            onClick={() => setTab(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === 'resumen' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-accent" />
                Objetivos del servicio
              </CardTitle>
              <CardDescription>Tres ejes: viabilidad técnica, concertación normativa, licencia de construcción.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                1. Viabilidad técnica de la formulación · 2. Concertación urbanística, jurídica y normativa ·
                3. Licencia expedida por Curaduría de Floridablanca.
              </p>
              <p>
                Referencia subdivisión: licencia <span className="font-mono text-foreground">{proposalMeta.licenseRef}</span>.
              </p>
              <Button asChild variant="secondary" className="mt-2 rounded-xl">
                <Link to={`${base}/recoleccion`}>
                  Ir a recolección documental
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Horizonte de semanas (referencia)</CardTitle>
              <CardDescription>Distribución orientativa por etapa de la propuesta.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={56} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} label={{ value: 'Sem.', angle: -90, position: 'insideLeft' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)' }} />
                  <Bar dataKey="semanas" fill="oklch(0.62 0.19 250)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {tab === 'entregables' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Table2 className="h-4 w-4 text-accent" />
              Entregables y trazabilidad operativa
            </CardTitle>
            <CardDescription>
              Marque cada ítem cuando esté listo en el expediente. Los enlaces abren el módulo donde se
              consolida el trabajo.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="border-b border-border px-3 py-2">Listo</th>
                  <th className="border-b border-border px-3 py-2">Entregable</th>
                  <th className="border-b border-border px-3 py-2">Notas</th>
                  <th className="border-b border-border px-3 py-2">Módulo</th>
                </tr>
              </thead>
              <tbody>
                {proposalChecklistItems.map((row) => (
                  <tr key={row.id} className="bg-white/90">
                    <td className="border-b border-border/80 px-3 py-2 align-middle">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-left"
                        onClick={() => void setCheck(row.id, !checklist[row.id])}
                        aria-pressed={!!checklist[row.id]}
                      >
                        {checklist[row.id] ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="border-b border-border/80 px-3 py-2 align-top font-medium">{row.label}</td>
                    <td className="border-b border-border/80 px-3 py-2 align-top text-muted-foreground">
                      {row.hint}
                    </td>
                    <td className="border-b border-border/80 px-3 py-2 align-top">
                      <Link
                        className="font-medium text-accent underline-offset-4 hover:underline"
                        to={`${base}/${row.route}`}
                      >
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}

      {tab === 'metodologia' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {methodologyBlocks.map((block) => (
            <Card key={block.title}>
              <CardHeader>
                <CardTitle className="text-base">{block.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {block.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'economico' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inversión y forma de pago</CardTitle>
              <CardDescription>Valores referenciales según propuesta ({proposalMeta.costLabel}).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-2xl font-semibold tabular-nums">{proposalMeta.costLabel}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {paymentSchedule.map((p) => (
                  <li key={p.milestone}>
                    <span className="font-semibold text-foreground">{p.pct}%</span> — {p.milestone}
                  </li>
                ))}
              </ul>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentChart} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" width={48} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="valor" fill="oklch(0.62 0.17 145)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notas internas del equipo</CardTitle>
              <CardDescription>Se guardan en metadata del proyecto (visible para el dueño del expediente).</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                key={`proposal-notes-${project.updated_at}`}
                defaultValue={
                  typeof project.metadata === 'object' &&
                  project.metadata &&
                  !Array.isArray(project.metadata) &&
                  typeof (project.metadata as Record<string, unknown>).proposal_notes === 'string'
                    ? ((project.metadata as Record<string, unknown>).proposal_notes as string)
                    : ''
                }
                placeholder="Acuerdos, riesgos, próximos pasos…"
                onBlur={async (e) => {
                  clear()
                  const nextMeta = {
                    ...(typeof project.metadata === 'object' && project.metadata && !Array.isArray(project.metadata)
                      ? (project.metadata as Record<string, unknown>)
                      : {}),
                    proposal_notes: e.target.value,
                  }
                  const { error: err } = await updateProject({ metadata: nextMeta as Json })
                  if (err) showError(err)
                  else showSuccess('Notas guardadas.')
                }}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
