import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useUlis } from '@/context/UlisContext'
import { Landmark, Map, Ruler, Trees } from 'lucide-react'

export function AnalisisNormativoPage() {
  const { metrics } = useUlis()
  const gate = metrics.overallProgress >= 72

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 4 · Análisis normativo
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            POT, reglamentación y determinantes del predio
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Validación estructurada frente al Plan de Ordenamiento Territorial vigente de
            Floridablanca, el Decreto 068 de 2016, el Acuerdo 0250 de 2025 y el marco de
            ordenamiento urbano nacional (Ley 388 de 1997 y Decreto 1077 de 2015).
          </p>
        </div>
        <Badge variant={gate ? 'success' : 'secondary'} className="w-fit">
          {gate ? 'Cruce normativo en curso' : 'Insumos normativos en consolidación'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="h-4 w-4 text-accent" />
              Validación POT
            </CardTitle>
            <CardDescription>
              Articulación de determinantes del suelo, usos compatibles y tratamientos del
              sector Cañaveral.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Se verifica la coherencia entre la licencia de subdivisión de origen y el
              proyecto de desarrollo actual, incluyendo cesiones tipo A y C, redes y
              servicios, y determinantes ambientales de manzana.
            </p>
            <Separator />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Cumplimiento POT (preliminar)
                </p>
                <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
                  {gate ? '86%' : '42%'}
                </p>
                <Progress value={gate ? 86 : 42} className="mt-3 h-2" />
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Coherencia Acuerdo 0250 / 2025
                </p>
                <p className="mt-2 text-sm">
                  {gate
                    ? 'Sin conflictos aparentes con el tratamiento previsto para el sector.'
                    : 'Pendiente cierre de fichas normativas y tratamiento urbanístico en recolección.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Ruler className="h-4 w-4 text-accent" />
              Índices urbanísticos
            </CardTitle>
            <CardDescription>
              Ocupación, construcción, densidad y controles de altura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Simulación volumétrica cruzada con exigencias de retiros, linderos y
              condicionantes de NSR-10.
            </p>
            <Separator />
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                <span className="text-foreground">IOC</span>
                <span className="font-mono text-foreground">OK simulado</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                <span className="text-foreground">IC</span>
                <span className="font-mono text-[oklch(0.35_0.08_75)]">Ajuste menor</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                <span className="text-foreground">Densidad vivienda</span>
                <span className="font-mono text-foreground">Dentro de rango</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Map className="h-4 w-4 text-accent" />
              Uso del suelo
            </CardTitle>
            <CardDescription>
              Compatibilidad funcional del proyecto con la clasificación del suelo y usos
              predominantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              El lote se analiza también frente a instrumentos de gestión del suelo y
              posibles actos de administración especial que puedan condicionar el
              licenciamiento.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trees className="h-4 w-4 text-accent" />
              Determinantes ambientales
            </CardTitle>
            <CardDescription>
              Redes, servicios, manejo de coberturas vegetales y riesgos asociados.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Se articula con estudios técnicos y disponibilidades de servicios públicos
              requeridas para la licencia de construcción en tratamiento de desarrollo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
