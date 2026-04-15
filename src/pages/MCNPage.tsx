import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useUlis } from '@/context/UlisContext'
import { CheckCircle2, Circle, Table2 } from 'lucide-react'

const rows = [
  {
    norma: 'POT Floridablanca – Usos y tratamiento',
    proyecto: 'Vivienda multifamiliar + comercio de baja afectación',
    estado: 'Cumple parcial',
  },
  {
    norma: 'Decreto 068 de 2016 – Documentación técnica',
    proyecto: 'Planimetría y memorias en consolidación',
    estado: 'En ajuste',
  },
  {
    norma: 'Ley 388 de 1997 – Instrumentos de gestión',
    proyecto: 'Coherencia con POT y acuerdos municipales',
    estado: 'Cumple',
  },
  {
    norma: 'Decreto 1077 de 2015 – Radicación',
    proyecto: 'Checklist legal en preparación',
    estado: 'Pendiente',
  },
]

export function MCNPage() {
  const { metrics } = useUlis()
  const active = metrics.collectionComplete

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 5 · Matriz de Cumplimiento Normativo (MCN)
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Cruce artículo por artículo
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            La MCN es el corazón trazable del expediente: cada exigencia normativa se cruza
            con el proyecto urbanístico, los planos y las memorias, dejando evidencia de
            cumplimiento, incumplimientos y justificaciones técnicas y jurídicas.
          </p>
        </div>
        <Badge variant={active ? 'success' : 'secondary'} className="w-fit">
          {active ? 'Motor MCN activo' : 'Bloqueado hasta 100% recolección'}
        </Badge>
      </div>

      {!active ? (
        <Card className="border-dashed border-accent/40 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">
              La matriz de cumplimiento normativo se activa una vez se complete el 100% de la
              recolección documental
            </CardTitle>
            <CardDescription>
              Este control de calidad evita construir una MCN sobre insumos incompletos,
              preservando la defensa jurídica del trámite y la coherencia con el concepto de
              viabilidad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Progreso actual de recolección</span>
              <Progress value={metrics.overallProgress} className="h-2 max-w-md flex-1" />
              <span className="font-semibold tabular-nums text-foreground">
                {metrics.overallProgress}%
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Table2 className="h-4 w-4 text-accent" />
            Tabla comparativa norma vs proyecto
          </CardTitle>
          <CardDescription>
            Vista ejecutiva; el detalle artículo a artículo se exporta en Reportes.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="border-b border-border px-3 py-2">Norma / determinante</th>
                <th className="border-b border-border px-3 py-2">Proyecto</th>
                <th className="border-b border-border px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.norma} className="bg-white/80">
                  <td className="border-b border-border/80 px-3 py-3 align-top text-foreground">
                    {r.norma}
                  </td>
                  <td className="border-b border-border/80 px-3 py-3 align-top text-muted-foreground">
                    {r.proyecto}
                  </td>
                  <td className="border-b border-border/80 px-3 py-3 align-top">
                    <Badge
                      variant={
                        r.estado === 'Cumple'
                          ? 'success'
                          : r.estado === 'Cumple parcial'
                            ? 'warning'
                            : r.estado === 'En ajuste'
                              ? 'warning'
                              : 'secondary'
                      }
                    >
                      {r.estado}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de cumplimiento global</CardTitle>
            <CardDescription>
              Sintetiza el porcentaje de exigencias con evidencia suficiente en expediente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">MCN consolidada</span>
              <span className="text-2xl font-semibold tabular-nums">
                {active ? '71%' : '0%'}
              </span>
            </div>
            <Progress value={active ? 71 : 0} className="h-2.5" />
            <p className="text-xs text-muted-foreground">
              {active
                ? 'Se están incorporando justificaciones técnicas y precedentes del Consejo de Estado y la Corte Constitucional.'
                : 'La MCN permanece en estado latente hasta cierre documental.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Checklist de blindaje</CardTitle>
            <CardDescription>
              Elementos mínimos para considerar la MCN “lista para radicación”.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              'Cuadro comparativo norma vs proyecto firmado por coordinación técnica.',
              'Identificación explícita de incumplimientos y rutas de mitigación.',
              'Jurisprudencia seleccionada con citas verificables.',
              'Doctrina urbanística aplicable al caso concreto.',
            ].map((t, i) => (
              <div key={t} className="flex items-start gap-2">
                {active && i < 2 ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 text-muted-foreground/40" />
                )}
                <p className="text-muted-foreground">{t}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
