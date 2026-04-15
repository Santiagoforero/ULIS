import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NoticeBanner } from '@/components/NoticeBanner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { useNotice } from '@/hooks/useNotice'
import { Building2, Clock3, ListChecks, MessageSquare } from 'lucide-react'

const ESTADOS = ['Pendiente', 'En curso', 'Cumplido', 'Bloqueado'] as const

export function LicenciamientoPage() {
  const { notice, showSuccess, showError, clear } = useNotice()
  const { licSteps, setLicStep, loading, error } = useProjectWorkspace()

  if (loading && !licSteps.length && !error) {
    return <p className="text-sm text-muted-foreground">Cargando licenciamiento…</p>
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 7 · Licenciamiento
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Curaduría Urbana</h2>
     
        </div>
        <Badge variant="secondary" className="w-fit">
          {licSteps.filter((s) => s.state_label === 'Cumplido').length}/{licSteps.length} hitos
          cumplidos
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-4 w-4 text-accent" />
              Timeline
            </CardTitle>
            <CardDescription>
              Días orientativos según propuesta; ajuste estados según Curaduría.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-3">
              {licSteps.map((step, idx) => (
                <li
                  key={step.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 text-sm shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Día hábil orientativo ~{step.expected_day_hint ?? '—'}
                    </p>
                  </div>
                  <Select
                    value={step.state_label}
                    onValueChange={async (v) => {
                      clear()
                      const { error: err } = await setLicStep(step.id, { state_label: v })
                      if (err) showError(err)
                      else showSuccess(`Estado actualizado: «${step.title}» → ${v}.`)
                    }}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <CardDescription>Informes y constancias (gestión externa a esta tabla).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Use el módulo de reportes para exportar el estado del expediente y adjuntar
              constancias de radicado cuando las tenga físicamente.
            </p>
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Curaduría Urbana de Floridablanca
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
            Registre requerimientos como observaciones en documentos o notas en radicación.
          </CardDescription>
        </CardHeader>
        
      </Card>
    </div>
  )
}
