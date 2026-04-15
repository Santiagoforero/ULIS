import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DocumentFilePreview } from '@/components/DocumentFilePreview'
import { IndeterminateProgress } from '@/components/IndeterminateProgress'
import { InlineConfirm } from '@/components/InlineConfirm'
import { NoticeBanner } from '@/components/NoticeBanner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import { useNotice } from '@/hooks/useNotice'
import type { DocStatus } from '@/types/database'
import { ClipboardList, Download, Layers, Trash2, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

function statusBadge(status: DocStatus) {
  if (status === 'pending')
    return <Badge variant="destructive">Pendiente</Badge>
  if (status === 'review')
    return <Badge variant="warning">En revisión</Badge>
  return <Badge variant="success">Completo</Badge>
}

function sectionProgress(docs: { status: DocStatus }[]) {
  const total = docs.length
  if (!total) return 0
  const done = docs.filter((d) => d.status === 'complete').length
  return Math.round((done / total) * 1000) / 10
}

type UploadUiState = {
  docId: string
  fileName: string
  pct: number
}

export function DocumentCollectionPage() {
  const {
    project,
    sections,
    metrics,
    loading,
    error,
    setDocStatus,
    setObservations,
    uploadDocumentFile,
    removeDocumentFile,
    getSignedUrl,
    addDocumentToSection,
    addSection,
  } = useProjectWorkspace()

  const { notice, showSuccess, showError, clear } = useNotice()
  const fileRef = useRef<HTMLInputElement>(null)
  const [targetDocId, setTargetDocId] = useState<string | null>(null)
  const [uploadUi, setUploadUi] = useState<UploadUiState | null>(null)
  const [sectionBusy, setSectionBusy] = useState(false)
  const [newDocTitle, setNewDocTitle] = useState<Record<string, string>>({})
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [newSectionDesc, setNewSectionDesc] = useState('')

  function pickFile(docId: string) {
    setTargetDocId(docId)
    fileRef.current?.click()
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const docId = targetDocId
    e.target.value = ''
    setTargetDocId(null)
    if (!file || !docId) return

    clear()
    setUploadUi({ docId, fileName: file.name, pct: 2 })
    const { error: err } = await uploadDocumentFile(docId, file, {
      onProgress: (pct) =>
        setUploadUi((prev) =>
          prev && prev.docId === docId ? { ...prev, pct: pct || prev.pct } : prev,
        ),
    })
    setUploadUi(null)
    if (err) {
      showError(err)
      return
    }
    showSuccess(`Archivo «${file.name}» subido correctamente. Estado del documento: en revisión.`)
  }

  async function onDownload(path: string) {
    clear()
    const url = await getSignedUrl(path)
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      showSuccess('Se abrió la descarga en una nueva pestaña (URL firmada, válida por tiempo limitado).')
    } else {
      showError('No se pudo generar el enlace de descarga. Intente de nuevo.')
    }
  }

  if (loading && !sections.length) {
    return (
      <div className="space-y-3">
        <IndeterminateProgress label="Cargando expediente desde Supabase…" />
      </div>
    )
  }
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  return (
    <div className="space-y-8">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
      />

      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Checklist documental
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Recolección documental</h2>
          
        </div>
        <Card className="w-full max-w-md border-accent/25 bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-accent" />
              Progreso del módulo
            </CardTitle>
            <CardDescription>
              Porcentaje según documentos en estado <span className="font-semibold text-foreground">Completo</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">Expediente</span>
              <span className="text-lg font-semibold tabular-nums">{metrics.overallProgress}%</span>
            </div>
            <Progress value={metrics.overallProgress} className="h-2.5" />
            <p className="text-xs text-muted-foreground">
              {metrics.complete} de {metrics.total} documentos completos · {metrics.loaded} con archivo
              cargado.
            </p>
          </CardContent>
        </Card>
      </div>

      {project ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold">{project.client_name ?? '—'}</p>
              <p className="text-muted-foreground">Att: {project.client_contact ?? '—'}</p>
              <Separator className="my-3" />
              <p className="font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground">{project.address ?? '—'}</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ampliar estructura del expediente
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Nueva sección (título)</Label>
                  <Input
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Ej. Estudios complementarios"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Descripción</Label>
                  <Input
                    value={newSectionDesc}
                    onChange={(e) => setNewSectionDesc(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                disabled={sectionBusy}
                onClick={async () => {
                  clear()
                  setSectionBusy(true)
                  const { error: err } = await addSection(newSectionTitle, newSectionDesc)
                  setSectionBusy(false)
                  if (err) {
                    showError(err)
                    return
                  }
                  setNewSectionTitle('')
                  setNewSectionDesc('')
                  showSuccess('Sección añadida al expediente.')
                }}
              >
                {sectionBusy ? 'Guardando…' : 'Añadir sección'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <ScrollArea className="max-h-none">
        <div className="space-y-6 pb-10">
          {sections.map((section) => {
            const pct = sectionProgress(section.project_documents)
            return (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader className="border-b border-border/80 bg-muted/30">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-accent" />
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                      <CardDescription>{section.description ?? ''}</CardDescription>
                    </div>
                    <div className="w-full max-w-xs space-y-2 sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Progreso de sección
                      </p>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <Progress value={pct} className="h-2 w-40 sm:w-44" />
                        <span className="text-sm font-semibold tabular-nums">{pct}%</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="divide-y divide-border/80 p-0">
                  <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Nuevo documento en esta sección</Label>
                      <Input
                        value={newDocTitle[section.id] ?? ''}
                        onChange={(e) =>
                          setNewDocTitle((m) => ({ ...m, [section.id]: e.target.value }))
                        }
                        placeholder="Título del ítem"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={async () => {
                        clear()
                        const t = (newDocTitle[section.id] ?? '').trim()
                        if (!t) {
                          showError('Escriba un título para el nuevo documento.')
                          return
                        }
                        const { error: err } = await addDocumentToSection(section.id, t)
                        if (err) {
                          showError(err)
                          return
                        }
                        setNewDocTitle((m) => ({ ...m, [section.id]: '' }))
                        showSuccess('Documento añadido a la sección.')
                      }}
                    >
                      Añadir documento
                    </Button>
                  </div>

                  {section.project_documents.map((doc) => {
                    const isUploading = uploadUi?.docId === doc.id
                    return (
                      <div key={doc.id} className="space-y-4 px-4 py-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {statusBadge(doc.status)}
                              <span className="text-[11px] font-mono text-muted-foreground">
                                ID · {doc.id.slice(0, 8)}…
                              </span>
                            </div>
                            <p className="text-sm font-semibold leading-snug">{doc.title}</p>
                            {doc.subtitle ? (
                              <p className="text-xs text-muted-foreground">{doc.subtitle}</p>
                            ) : null}

                            {doc.storage_path ? (
                              <>
                                <DocumentFilePreview
                                  storagePath={doc.storage_path}
                                  fileName={doc.file_name}
                                  fileMime={doc.file_mime}
                                  getSignedUrl={getSignedUrl}
                                />
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  {doc.uploaded_at ? (
                                    <span className="font-mono">
                                      Subido: {new Date(doc.uploaded_at).toLocaleString('es-CO')}
                                    </span>
                                  ) : null}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1 px-2"
                                    onClick={() => void onDownload(doc.storage_path!)}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    Descargar / abrir
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                Sin archivo en el repositorio. Use «Subir archivo» para adjuntar el
                                soporte.
                              </p>
                            )}
                          </div>

                          <div className="flex w-full flex-col gap-3 lg:w-72">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Estado</Label>
                              <Select
                                value={doc.status}
                                onValueChange={async (v) => {
                                  clear()
                                  const { error: err } = await setDocStatus(doc.id, v as DocStatus)
                                  if (err) {
                                    showError(err)
                                    return
                                  }
                                  showSuccess('Estado del documento actualizado.')
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="review">En revisión</SelectItem>
                                  <SelectItem value="complete">Completo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                              {isUploading ? (
                                <div className="space-y-2 rounded-xl border border-accent/25 bg-accent/5 p-3">
                                  <p className="text-xs font-medium text-foreground">
                                    Subiendo {uploadUi?.fileName ?? 'archivo'}…
                                  </p>
                                  {uploadUi && uploadUi.pct >= 8 ? (
                                    <Progress value={uploadUi.pct} className="h-2" />
                                  ) : (
                                    <IndeterminateProgress />
                                  )}
                                </div>
                              ) : (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="w-full gap-2 rounded-xl"
                                  onClick={() => pickFile(doc.id)}
                                >
                                  <UploadCloud className="h-4 w-4" />
                                  Subir archivo
                                </Button>
                              )}
                              {doc.storage_path ? (
                                <InlineConfirm
                                  triggerLabel="Quitar archivo"
                                  leadingIcon={<Trash2 className="h-4 w-4" />}
                                  confirmLabel="Sí, quitar"
                                  variant="outline"
                                  className="w-full gap-2 rounded-xl text-destructive hover:text-destructive"
                                  onConfirm={async () => {
                                    clear()
                                    const { error: err } = await removeDocumentFile(doc.id)
                                    if (err) {
                                      showError(err)
                                      return Promise.reject()
                                    }
                                    showSuccess('Archivo eliminado del repositorio.')
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Observaciones</Label>
                          <Textarea
                            key={`${doc.id}-${doc.updated_at}`}
                            defaultValue={doc.observations}
                            onBlur={async (e) => {
                              const { error: err } = await setObservations(doc.id, e.target.value)
                              if (err) {
                                clear()
                                showError(err)
                              }
                            }}
                            placeholder="Notas del equipo…"
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
