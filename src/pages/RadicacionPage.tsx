import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NoticeBanner } from '@/components/NoticeBanner'
import { Separator } from '@/components/ui/separator'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { useNotice } from '@/hooks/useNotice'
import { ClipboardList, FileText, Gavel } from 'lucide-react'

export function RadicacionPage() {
  const { notice, showSuccess, showError, clear } = useNotice()
  const { metrics, radItems, setRadItem, loading, error } = useProjectWorkspace()
  const prep = Math.min(100, Math.round(metrics.loaded * 2.2))

  if (loading && !radItems.length && !error) {
    return <p className="text-sm text-muted-foreground">Cargando radicación…</p>
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 6 · Radicación
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Legal y debida forma</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Checklist persistido en base de datos; marque ítems satisfechos cuando exista soporte
            en expediente.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-accent/40 text-accent">
          Preparación referencial {prep}%
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gavel className="h-4 w-4 text-accent" />
              Checklist Decreto 1077 de 2015
            </CardTitle>
            <CardDescription>
              Cada ítem se actualiza en vivo. Notas opcionales por renglón.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {radItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-start"
              >
                <label className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border"
                    checked={item.is_satisfied}
                    onChange={async (e) => {
                      clear()
                      const { error: err } = await setRadItem(item.id, {
                        is_satisfied: e.target.checked,
                      })
                      if (err) showError(err)
                      else showSuccess(e.target.checked ? 'Ítem marcado como satisfecho.' : 'Ítem desmarcado.')
                    }}
                  />
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </label>
                <div className="min-w-0 flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Notas</Label>
                  <Input
                    key={`${item.id}-${item.updated_at}`}
                    defaultValue={item.notes}
                    onBlur={async (e) => {
                      const { error: err } = await setRadItem(item.id, { notes: e.target.value })
                      if (err) {
                        clear()
                        showError(err)
                      }
                    }}
                  />
                </div>
                <ClipboardList
                  className={`mt-1 hidden h-4 w-4 shrink-0 sm:block ${item.is_satisfied ? 'text-success' : 'text-muted-foreground'}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-accent" />
              Resumen documental
            </CardTitle>
            <CardDescription>Desde recolección (Supabase).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ítems con archivo
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                {metrics.loaded}
              </p>
            </div>
            <Separator />
            <p>Documentos completos (estado): {metrics.complete}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
