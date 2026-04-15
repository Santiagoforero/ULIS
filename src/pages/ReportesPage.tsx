import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { metaStrings } from '@/lib/metadata'
import { Download, FileSpreadsheet, Layers } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

function downloadBlob(filename: string, mime: string, body: string) {
  const blob = new Blob([body], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ReportesPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const base = `/p/${projectId ?? ''}`
  const { project, sections, metrics, loading, error } = useProjectWorkspace()
  const meta = project ? metaStrings(project.metadata) : {}

  function exportCsv() {
    const lines = ['seccion,titulo_documento,estado,tiene_archivo,observaciones']
    for (const s of sections) {
      for (const d of s.project_documents) {
        const row = [
          s.title.replaceAll(',', ';'),
          d.title.replaceAll(',', ';'),
          d.status,
          d.storage_path ? 'si' : 'no',
          (d.observations ?? '').replaceAll(/[\r\n,]/g, ' '),
        ]
        lines.push(row.join(','))
      }
    }
    downloadBlob(`ulis_${project?.name ?? 'expediente'}.csv`, 'text/csv;charset=utf-8', lines.join('\n'))
  }

  function exportJson() {
    const payload = {
      proyecto: project,
      metadata: meta,
      kpis: metrics,
      secciones: sections.map((s) => ({
        titulo: s.title,
        descripcion: s.description,
        documentos: s.project_documents,
      })),
      exportado_en: new Date().toISOString(),
    }
    downloadBlob(
      `ulis_${project?.name ?? 'expediente'}.json`,
      'application/json',
      JSON.stringify(payload, null, 2),
    )
  }

  if (loading && !project) {
    return <p className="text-sm text-muted-foreground">Cargando reportes…</p>
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Módulo 8 · Reportes
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Exportaciones</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Generación local a partir de los datos actuales en memoria (recién cargados desde
          Supabase).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary" className="gap-2 rounded-xl">
          <Link to={`${base}/entregables`}>
            <Layers className="h-4 w-4" />
            Taller de entregables (due diligence, contingencia, informe quincenal…)
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Resumen</CardTitle>
            <CardDescription>Indicadores en vivo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">Progreso</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{metrics.overallProgress}%</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">Con archivo</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{metrics.loaded}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">Riesgo jurídico</p>
              <p className="mt-2 text-lg font-semibold capitalize">{metrics.legalRisk}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descargas</CardTitle>
            <CardDescription>CSV y JSON completos del checklist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start gap-2 rounded-xl"
              variant="secondary"
              type="button"
              onClick={exportCsv}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Checklist CSV
            </Button>
            <Button
              className="w-full justify-start gap-2 rounded-xl"
              variant="secondary"
              type="button"
              onClick={exportJson}
            >
              <Download className="h-4 w-4" />
              Expediente JSON
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referencia contractual (metadata)</CardTitle>
          <CardDescription>Valores almacenados en el proyecto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Honorarios referencia: {meta.reference_fee_cop ?? '—'}</p>
          <p>Fecha propuesta: {meta.proposal_ref_date ?? '—'}</p>
          <Separator className="my-3" />
          <p className="text-xs">
            Para modificar metadata use el panel SQL o amplíe la UI de administración del
            proyecto.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
