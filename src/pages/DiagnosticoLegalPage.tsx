import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useUlis } from '@/context/UlisContext'
import { PROJECT } from '@/lib/projectMeta'
import {
  BookMarked,
  GitBranch,
  Scale,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function DiagnosticoLegalPage() {
  const { metrics } = useUlis()
  const unlocked = metrics.collectionComplete

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 3 · Diagnóstico legal
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Estudio de títulos y riesgos jurídicos
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Consolidación del análisis dominial a 30 años, gravámenes y actos limitativos,
            articulado con el informe de due diligence inmobiliaria y los conceptos jurídicos
            vinculantes por etapa.
          </p>
        </div>
        <Badge variant={unlocked ? 'success' : 'secondary'} className="w-fit">
          {unlocked ? 'Desbloqueado por completitud documental' : 'En espera de cierre Fase 1'}
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
              Este módulo se alimenta directamente de la recolección documental. Complete el
              checklist en{' '}
              <Link className="font-semibold text-accent underline-offset-4 hover:underline" to="/recoleccion">
                Recolección Documental
              </Link>{' '}
              para activar el flujo de diagnóstico con trazabilidad plena.
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
              Revisión de cadena transmisiva y coherencia de las tradiciones aplicables al
              predio {PROJECT.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Se modelan las sucesiones de dominio, personerías de otorgantes y capacidad,
              cruzando escrituras, resoluciones administrativas y anotaciones registrales.
            </p>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-3 text-xs shadow-sm">
                <p className="font-semibold text-foreground">Gravámenes activos</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
                  {unlocked ? '2' : '—'}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Hipoteca en estudio de extinción.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-3 text-xs shadow-sm">
                <p className="font-semibold text-foreground">Alertas dominiales</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-[oklch(0.35_0.08_75)]">
                  {unlocked ? '1' : '—'}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Posible diferencia menor de linderos en revisión catastral.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-3 text-xs shadow-sm">
                <p className="font-semibold text-foreground">Titularidades concurrentes</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-success">
                  {unlocked ? '0' : '—'}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sin conflictos de titularidad detectados en simulación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-4 w-4 text-accent" />
              Validación 30 años
            </CardTitle>
            <CardDescription>Avance de revisión temporal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={unlocked ? 78 : 12} className="h-2.5" />
            <p className="text-xs text-muted-foreground">
              {unlocked
                ? 'Cadena dominial reconstruida con énfasis en actos posteriores a la subdivisión aprobada.'
                : 'Esperando insumos de escrituras y certificaciones para cerrar la línea temporal.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            Riesgos jurídicos detectados
          </CardTitle>
          <CardDescription>
            Matriz cualitativa de exposición a nulidades, revocatorias directas y oposición
            de terceros interesados.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Riesgo procedimental',
              level: 'Medio',
              detail:
                'Dependencia de subsanaciones en Curaduría si no se cierra concordancia catastral–registral.',
            },
            {
              title: 'Riesgo urbanístico',
              level: 'Bajo',
              detail:
                'Proyecto alineado en simulación con tratamiento del sector y cargas VIP previstas en POT.',
            },
            {
              title: 'Riesgo reputacional / terceros',
              level: 'Medio',
              detail:
                'Posibles oposiciones de vecinos por densificación; se prepara plan de contingencia jurídica.',
            },
          ].map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-border bg-white p-4 text-sm shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {r.title}
              </p>
              <p className="mt-2 text-lg font-semibold">{r.level}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookMarked className="h-4 w-4 text-accent" />
              Entregables jurídicos
            </CardTitle>
            <CardDescription>
              Documentos firmados por abogado y anexos al informe técnico.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>· Concepto jurídico de viabilidad vinculante.</p>
            <p>· Informe de due diligence inmobiliaria integral.</p>
            <p>· Estudio de títulos con énfasis en blindaje ante Curaduría.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-accent" />
              Próximo paso automático
            </CardTitle>
            <CardDescription>
              Cuando el diagnóstico se declare estable, ULIS sugiere iniciar el cruce
              normativo fino del POT y reglamentación sectorial.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              El motor de análisis normativo se nutre de los insumos catastrales y de la
              validación de índices urbanísticos del lote, garantizando consistencia entre
              MCN y radicación Decreto 1077 de 2015.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
