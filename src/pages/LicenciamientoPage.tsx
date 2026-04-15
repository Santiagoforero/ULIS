import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Building2, Clock3, ListChecks, MessageSquare } from 'lucide-react'

const timeline = [
  { title: 'Radicación en legal y debida forma', state: 'Pendiente', days: 0 },
  { title: 'Asignación a revisión técnica', state: 'Pendiente', days: 5 },
  { title: 'Concepto técnico intermedio', state: 'Pendiente', days: 15 },
  { title: 'Requerimientos y subsanaciones', state: 'Pendiente', days: 30 },
  { title: 'Resolución de licencia de construcción', state: 'Pendiente', days: 45 },
]

export function LicenciamientoPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 7 · Licenciamiento
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Curaduría Urbana de Floridablanca
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Seguimiento del trámite de licencia de construcción, incluyendo pronunciamientos,
            requerimientos, reuniones de trabajo y estrategia de respuesta fundada en
            derecho administrativo urbanístico.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Trámite aún no radicado
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-4 w-4 text-accent" />
              Timeline de Curaduría (45 días hábiles referenciales)
            </CardTitle>
            <CardDescription>
              El conteo oficial inicia tras acreditarse el legal y debida forma; los tiempos
              reales dependen de la entidad.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Avance simulado del trámite</span>
              <Progress value={8} className="h-2 flex-1" />
              <span className="font-semibold tabular-nums text-foreground">8%</span>
            </div>
            <ol className="space-y-3">
              {timeline.map((step, idx) => (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-2xl border border-border bg-white p-4 text-sm shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Meta orientativa: día hábil ~{step.days}
                    </p>
                  </div>
                  <Badge variant="secondary">{step.state}</Badge>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-accent" />
              Seguimiento
            </CardTitle>
            <CardDescription>
              Informe jurídico quincenal y constancias de trámite (simulación).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              ULIS documentará cada respuesta a requerimientos, anexando radicados y
              constancias de entrega para defensa ante posibles controversias.
            </p>
            <Separator />
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Curaduría Urbana de Floridablanca
              </p>
              <p className="mt-2">
                Coordinación de reuniones técnicas y validación de observaciones de fondo y
                de forma.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-accent" />
            Requerimientos
          </CardTitle>
          <CardDescription>
            Registro de observaciones de la Curaduría y plan de subsanación.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Aún no hay requerimientos registrados. Cuando el trámite ingrese en estado activo,
            cada requerimiento generará un sub–expediente con responsables, plazos y
            estrategia de contestación.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
