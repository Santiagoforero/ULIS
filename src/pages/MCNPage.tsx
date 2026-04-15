import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InlineConfirm } from '@/components/InlineConfirm'
import { NoticeBanner } from '@/components/NoticeBanner'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { useNotice } from '@/hooks/useNotice'
import { Plus, Table2, Trash2 } from 'lucide-react'

export function MCNPage() {
  const { notice, showSuccess, showError, clear } = useNotice()
  const {
    metrics,
    mcnRows,
    addMcnRow,
    updateMcnRow,
    deleteMcnRow,
    loading,
    error,
  } = useProjectWorkspace()

  const active = metrics.collectionComplete
  const mcnProgress =
    mcnRows.length === 0
      ? 0
      : Math.round(
          (mcnRows.filter((r) => r.norma.trim() && r.proyecto.trim() && r.estado.trim()).length /
            mcnRows.length) *
            1000,
        ) / 10

  if (loading && !mcnRows.length && !error) {
    return <p className="text-sm text-muted-foreground">Cargando MCN…</p>
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <div className="space-y-8">
      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulo 5 · MCN
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Matriz de Cumplimiento Normativo</h2>
          
        </div>
        <Badge variant={active ? 'success' : 'secondary'} className="w-fit">
          {active ? 'Recolección al 100%' : 'Recolección incompleta'}
        </Badge>
      </div>

      {!active ? (
        <Card className="border-dashed border-accent/40 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">
              La MCN operativa se recomienda tras el 100% de recolección documental
            </CardTitle>
            <CardDescription>
              Puede ir registrando filas desde ya; el indicador superior refleja el cierre de la
              fase 1.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Progreso recolección</span>
              <Progress value={metrics.overallProgress} className="h-2 max-w-md flex-1" />
              <span className="font-semibold tabular-nums text-foreground">
                {metrics.overallProgress}%
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Completitud de filas (norma + proyecto + estado rellenos):{' '}
          <span className="font-semibold text-foreground">{mcnProgress}%</span>
        </p>
        <Button
          type="button"
          className="gap-2 rounded-xl"
          onClick={async () => {
            clear()
            const { error: e } = await addMcnRow()
            if (e) showError(e)
            else showSuccess('Fila añadida a la matriz.')
          }}
        >
          <Plus className="h-4 w-4" />
          Añadir fila
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Table2 className="h-4 w-4 text-accent" />
            Tabla comparativa
          </CardTitle>
          <CardDescription>Los cambios se guardan al salir de cada campo (blur).</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {mcnRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay filas. Pulse «Añadir fila» para crear la primera comparación.
            </p>
          ) : (
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="border-b border-border px-2 py-2">Norma / determinante</th>
                  <th className="border-b border-border px-2 py-2">Proyecto</th>
                  <th className="border-b border-border px-2 py-2">Estado</th>
                  <th className="border-b border-border px-2 py-2 w-12" />
                </tr>
              </thead>
              <tbody>
                {mcnRows.map((r) => (
                  <tr key={r.id} className="bg-white/80">
                    <td className="border-b border-border/80 p-1 align-top">
                      <Input
                        key={`n-${r.id}-${r.updated_at}`}
                        defaultValue={r.norma}
                        onBlur={async (e) => {
                          const { error: err } = await updateMcnRow(r.id, { norma: e.target.value })
                          if (err) {
                            clear()
                            showError(err)
                          }
                        }}
                        className="border-0 shadow-none focus-visible:ring-1"
                      />
                    </td>
                    <td className="border-b border-border/80 p-1 align-top">
                      <Input
                        key={`p-${r.id}-${r.updated_at}`}
                        defaultValue={r.proyecto}
                        onBlur={async (e) => {
                          const { error: err } = await updateMcnRow(r.id, { proyecto: e.target.value })
                          if (err) {
                            clear()
                            showError(err)
                          }
                        }}
                        className="border-0 shadow-none focus-visible:ring-1"
                      />
                    </td>
                    <td className="border-b border-border/80 p-1 align-top">
                      <Input
                        key={`e-${r.id}-${r.updated_at}`}
                        defaultValue={r.estado}
                        onBlur={async (e) => {
                          const { error: err } = await updateMcnRow(r.id, { estado: e.target.value })
                          if (err) {
                            clear()
                            showError(err)
                          }
                        }}
                        className="border-0 shadow-none focus-visible:ring-1"
                        placeholder="Cumple / No cumple / …"
                      />
                    </td>
                    <td className="border-b border-border/80 p-1 align-top">
                      <InlineConfirm
                        triggerLabel=""
                        leadingIcon={<Trash2 className="h-4 w-4" />}
                        confirmLabel="Eliminar"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        aria-label="Eliminar fila"
                        onConfirm={async () => {
                          clear()
                          const { error: err } = await deleteMcnRow(r.id)
                          if (err) {
                            showError(err)
                            return Promise.reject()
                          }
                          showSuccess('Fila eliminada.')
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
