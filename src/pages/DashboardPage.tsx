import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useUlis } from '@/context/UlisContext'
import { PHASES, PROJECT } from '@/lib/projectMeta'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  FileStack,
  Shield,
  Timer,
} from 'lucide-react'
import { Link } from 'react-router-dom'

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
  const { metrics } = useUlis()

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
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Metodología estructurada para acompañar el proyecto desde el estudio documental
            hasta la licencia de construcción ante la Curaduría Urbana de Floridablanca, con
            rigurosidad jurídica y trazabilidad de cada entrega.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={riskVariant(metrics.legalRisk)} className="px-3 py-1 text-xs">
            Riesgo jurídico estimado: {riskLabel(metrics.legalRisk)}
          </Badge>
          <Button asChild variant="secondary" className="rounded-xl">
            <Link to="/recoleccion">
              Ir a recolección
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Proyecto cargado</CardTitle>
            <CardDescription>
              Seguimiento integral del encargo para{' '}
              <span className="font-medium text-foreground">{PROJECT.client}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Denominación
                </p>
                <p className="mt-1 text-lg font-semibold">{PROJECT.name}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {PROJECT.address} · {PROJECT.municipality}, {PROJECT.department}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Estado macro del servicio
                </p>
                <p className="mt-1 text-lg font-semibold">{PROJECT.macroState}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Fase operativa:{' '}
                  <span className="font-semibold text-foreground">
                    {PROJECT.phaseLabel}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-muted-foreground">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p>
                  La matriz de cumplimiento normativo se activa una vez se complete el{' '}
                  <span className="font-semibold text-foreground">100%</span> de la
                  recolección documental. Hasta entonces, el motor de MCN permanece en modo
                  insumo y validación de completitud.
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Progreso general del expediente</span>
                <span className="tabular-nums text-muted-foreground">
                  {metrics.overallProgress}% basado en ítems completos
                </span>
              </div>
              <Progress value={metrics.overallProgress} className="h-2.5" />
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold">Antecedente urbanístico relevante</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Licencia de subdivisión{' '}
                <span className="font-mono text-foreground">
                  {PROJECT.subdivisionLicense}
                </span>{' '}
                expedida por la {PROJECT.subdivisionAuthority} el{' '}
                {PROJECT.subdivisionDate}, como trazabilidad de origen del lote.
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
            <CardDescription>Indicadores en tiempo real del checklist Mardel – Legal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs text-muted-foreground">Requeridos</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{metrics.total}</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs text-muted-foreground">Cargados</p>
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
                Horizonte contractual referencial
              </p>
              <p className="mt-2 leading-relaxed">
                Fase documental y modelación: ~4 semanas a radicación en debida forma.
                Radicación coordinada: ~1 semana. Trámite de licencia: hasta 45 días hábiles
                posteriores a legal y debida forma (sujeto a Curaduría).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline del proyecto</CardTitle>
          <CardDescription>
            Secuencia metodológica con fase activa resaltada. Cada etapa genera entregables
            jurídicos vinculantes y trazabilidad de radicados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PHASES.map((phase, idx) => {
              const active = phase.id === 'recoleccion'
              const done =
                phase.id === 'recoleccion'
                  ? metrics.overallProgress >= 100
                  : false
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        Bloqueada por secuencia o completitud documental.
                      </p>
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
              El semáforo de riesgo se alimenta del avance documental y de la densidad de
              ítems en revisión técnica–jurídica.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              A medida que se consolidan títulos, cargas y concordancia catastral–registral,
              desciende la probabilidad de sorpresas dominiales y de observaciones de fondo
              en Curaduría.
            </p>
            <p>
              La metodología ULIS documenta cada transición de estado, observaciones del
              equipo y versiones de archivo para auditoría posterior o defensa en sede
              administrativa.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contacto del equipo director</CardTitle>
            <CardDescription>
              Coordinación técnica–jurídica y representación ante Curaduría Urbana de
              Floridablanca.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">{PROJECT.consultant}</p>
            <p className="text-xs text-muted-foreground">{PROJECT.consultantRole}</p>
            <Separator className="my-3" />
            <p>
              <span className="text-muted-foreground">Teléfono:</span>{' '}
              <span className="font-mono">{PROJECT.consultantPhone}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Correo:</span>{' '}
              <a
                className="font-medium text-accent underline-offset-4 hover:underline"
                href={`mailto:${PROJECT.consultantEmail}`}
              >
                {PROJECT.consultantEmail}
              </a>
            </p>
            <p>
              <span className="text-muted-foreground">Oficina:</span>{' '}
              {PROJECT.consultantAddress}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
