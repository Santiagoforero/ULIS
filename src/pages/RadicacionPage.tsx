import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useUlis } from '@/context/UlisContext'
import { ClipboardList, FileText, Gavel, Send } from 'lucide-react'

const checklist1077 = [
  'Certificado de libertad y tradición',
  'Recibo del último impuesto predial',
  'Cámara de comercio de la constructora',
  'Documento de identidad del representante legal',
  'Escrituras y documentación de propiedad',
  'Carta catastral y certificaciones asociadas',
  'Plano PUG aprobado y licencias de primera etapa',
  'Disponibilidades de servicios públicos vigentes',
]

export function RadicacionPage() {
  const { metrics } = useUlis()
  const prep = Math.min(100, Math.round(metrics.loaded * 2.2))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 6 · Radicación
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Legal y debida forma ante Curaduría
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Administración del paquete de radicación conforme al Decreto 1077 de 2015 y
            lineamientos específicos de la Curaduría Urbana de Floridablanca, articulando
            documentación jurídica y técnica.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-accent/40 text-accent">
          Preparación {prep}%
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gavel className="h-4 w-4 text-accent" />
              Checklist legal Decreto 1077 de 2015
            </CardTitle>
            <CardDescription>
              Estado referencial de cumplimiento formal; se alimenta de la recolección y de
              los documentos jurídicos corporativos del cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {checklist1077.map((item, idx) => {
              const ok = metrics.complete > idx + 18
              return (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-white p-3 text-sm shadow-sm"
                >
                  <ClipboardList
                    className={`mt-0.5 h-4 w-4 ${ok ? 'text-success' : 'text-muted-foreground'}`}
                  />
                  <div>
                    <p className="font-medium text-foreground">{item}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {ok
                        ? 'Documento localizado en repositorio ULIS.'
                        : 'Pendiente de consolidación o vinculación al expediente.'}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-accent" />
              Documentos cargados
            </CardTitle>
            <CardDescription>
              Sincronía con el checklist Mardel – Legal y anexos técnicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ítems con soporte en ULIS
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                {metrics.loaded}
              </p>
            </div>
            <Separator />
            <p>
              Antes de radicar, el equipo validará originalidad de firmas, literalidad de
              poderes y correlación catastral–registral con los planos arquitectónicos.
            </p>
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Send className="h-3.5 w-3.5" />
                Próxima acción
              </p>
              <p className="mt-2">
                Coordinación de radicación digital y física (según instructivo vigente de la
                Curaduría) una vez cerrada la MCN y el concepto jurídico de viabilidad.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
