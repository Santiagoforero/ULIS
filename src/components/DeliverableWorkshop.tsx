import { DocumentFilePreview } from '@/components/DocumentFilePreview'
import { InlineConfirm } from '@/components/InlineConfirm'
import { NoticeBanner } from '@/components/NoticeBanner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import {
  computeDeliverableProgress,
  getWorksheetState,
  mergeDeliverablesIntoMetadata,
  parseDeliverablesMetadata,
  type DeliverableWorksheetState,
} from '@/lib/deliverableMetadata'
import type { DeliverableDefinition } from '@/lib/deliverablesRegistry'
import type { Json } from '@/types/database'
import { BookOpen, FileUp, Lightbulb, Link2, Plus, Table2, Trash2, Upload } from 'lucide-react'
import { useNotice } from '@/hooks/useNotice'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  def: DeliverableDefinition
  basePath: string
}

function emptyRow(keys: string[]): Record<string, string> {
  const o: Record<string, string> = {}
  for (const k of keys) o[k] = ''
  return o
}

export function DeliverableWorkshop({ def, basePath }: Props) {
  const {
    project,
    patchProjectMetadata,
    uploadDeliverableFinalFile,
    removeDeliverableFinalFile,
    getSignedUrl,
  } = useProjectWorkspace()
  const { notice, showSuccess, showError, clear } = useNotice()

  const [sheet, setSheet] = useState<DeliverableWorksheetState>(() =>
    getWorksheetState(project?.metadata ?? null, def),
  )
  const [tab, setTab] = useState<'guia' | 'plantillas' | 'notas' | 'final'>('guia')

  useEffect(() => {
    setSheet(getWorksheetState(project?.metadata ?? null, def))
  }, [project?.metadata, project?.updated_at, def])

  const finalFiles = parseDeliverablesMetadata(project?.metadata).deliverable_final_files?.[def.id]

  const progress = useMemo(
    () => computeDeliverableProgress(def, sheet, finalFiles),
    [def, sheet, finalFiles],
  )

  const saveSheet = async (next: DeliverableWorksheetState) => {
    setSheet(next)
    const { error } = await patchProjectMetadata((prev) =>
      mergeDeliverablesIntoMetadata(prev as Json, {
        deliverable_worksheets: { [def.id]: next },
      }) as Record<string, unknown>,
    )
    if (error) showError(error)
  }

  const updateCell = (tableKey: string, rowIdx: number, colKey: string, value: string) => {
    const t = sheet.tables[tableKey]
    if (!t) return
    const rows = t.rows.map((r, i) =>
      i === rowIdx ? { ...r, [colKey]: value } : { ...r },
    )
    void saveSheet({ ...sheet, tables: { ...sheet.tables, [tableKey]: { rows } } })
  }

  const addRow = async (tableKey: string, colKeys: string[]) => {
    const t = sheet.tables[tableKey]
    if (!t) return
    await saveSheet({
      ...sheet,
      tables: {
        ...sheet.tables,
        [tableKey]: { rows: [...t.rows, emptyRow(colKeys)] },
      },
    })
  }

  const removeRow = async (tableKey: string, rowIdx: number) => {
    const t = sheet.tables[tableKey]
    if (!t || t.rows.length <= 1) return
    await saveSheet({
      ...sheet,
      tables: {
        ...sheet.tables,
        [tableKey]: { rows: t.rows.filter((_, i) => i !== rowIdx) },
      },
    })
  }

  const updateNote = async (key: string, value: string) => {
    await saveSheet({
      ...sheet,
      notes: { ...sheet.notes, [key]: value },
    })
  }

  return (
    <div className="space-y-6">
      {notice ? <NoticeBanner notice={notice} onDismiss={clear} /> : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-lg">
              {def.phaseLabel}
            </Badge>
            <span className="text-xs text-muted-foreground">Fase {def.phase}</span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{def.title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{def.proposalRef}</p>
        </div>
        <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Avance del taller
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-sm font-semibold tabular-nums">{progress}%</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Incluye plantillas, notas y archivo final opcional.
          </p>
        </div>
      </div>

      {def.relatedModule ? (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm">
              <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                Datos operativos en el módulo relacionado:{' '}
                <Link
                  className="font-semibold text-accent underline-offset-4 hover:underline"
                  to={`${basePath}/${def.relatedModule}`}
                >
                  Abrir módulo
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['guia', 'Cómo se elabora', BookOpen],
            ['plantillas', 'Plantillas por sección', Table2],
            ['notas', 'Notas del borrador', Lightbulb],
            ['final', 'Entregable final', Upload],
          ] as const
        ).map(([id, label, Icon]) => (
          <Button
            key={id}
            type="button"
            variant={tab === id ? 'default' : 'outline'}
            className="gap-2 rounded-xl"
            onClick={() => {
              clear()
              setTab(id)
            }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {tab === 'guia' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {def.methodology.map((block) => (
            <Card key={block.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-accent" />
                  {block.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  {block.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'plantillas' ? (
        <div className="space-y-8">
          {def.tables.map((tbl) => {
            const rows = sheet.tables[tbl.key]?.rows ?? []
            const colKeys = tbl.columns.map((c) => c.key)
            return (
              <Card key={tbl.key}>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-base">{tbl.title}</CardTitle>
                    <CardDescription>{tbl.description}</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="shrink-0 gap-2 rounded-xl"
                    onClick={() => {
                      clear()
                      void addRow(tbl.key, colKeys).then(() => showSuccess('Fila añadida.'))
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Añadir fila
                  </Button>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                        {tbl.columns.map((c) => (
                          <th key={c.key} className="border-b border-border px-2 py-2">
                            {c.label}
                          </th>
                        ))}
                        <th className="border-b border-border px-1 py-2 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, ri) => (
                        <tr key={ri} className="bg-white/80">
                          {tbl.columns.map((c) => (
                            <td key={c.key} className="border-b border-border/80 p-1 align-top">
                              <Input
                                defaultValue={row[c.key] ?? ''}
                                key={`${tbl.key}-${ri}-${c.key}-${project?.updated_at ?? ''}`}
                                onBlur={(e) => {
                                  clear()
                                  updateCell(tbl.key, ri, c.key, e.target.value)
                                }}
                                className="border-0 shadow-none focus-visible:ring-1"
                              />
                            </td>
                          ))}
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
                                await removeRow(tbl.key, ri)
                                showSuccess('Fila eliminada.')
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : null}

      {tab === 'notas' ? (
        <div className="space-y-6">
          {def.noteSections.map((ns) => (
            <Card key={ns.key}>
              <CardHeader>
                <CardTitle className="text-base">{ns.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  key={`${ns.key}-${project?.updated_at ?? ''}`}
                  defaultValue={sheet.notes[ns.key] ?? ''}
                  placeholder={ns.placeholder}
                  className="min-h-[140px] rounded-xl"
                  onBlur={async (e) => {
                    clear()
                    updateNote(ns.key, e.target.value)
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'final' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileUp className="h-4 w-4 text-accent" />
              Documento final del entregable
            </CardTitle>
            <CardDescription>
              Suba el PDF o paquete definitivo firmado. Puede coexistir con el trabajo en módulos
              (MCN en base de datos, radicación, etc.).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 transition hover:bg-muted/50">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Elegir archivo o arrastrar aquí</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.zip"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  e.target.value = ''
                  if (!f) return
                  clear()
                  const { error } = await uploadDeliverableFinalFile(def.id, f)
                  if (error) showError(error)
                  else showSuccess('Archivo vinculado al entregable.')
                }}
              />
            </label>

            {finalFiles && finalFiles.length > 0 ? (
              <ul className="space-y-4">
                {finalFiles.map((file, idx) => (
                  <li
                    key={`${file.storage_path}-${idx}`}
                    className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{file.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.uploaded_at).toLocaleString()}
                        </p>
                      </div>
                      <InlineConfirm
                        triggerLabel="Quitar"
                        confirmLabel="Eliminar archivo"
                        variant="outline"
                        className="text-destructive"
                        onConfirm={async () => {
                          clear()
                          const { error } = await removeDeliverableFinalFile(def.id, idx)
                          if (error) {
                            showError(error)
                            return Promise.reject()
                          }
                          showSuccess('Archivo eliminado.')
                        }}
                      />
                    </div>
                    <Separator className="my-3" />
                    <DocumentFilePreview
                      storagePath={file.storage_path}
                      fileName={file.file_name}
                      fileMime={file.file_mime}
                      getSignedUrl={getSignedUrl}
                      className="min-h-[320px]"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aún no hay archivos finales.</p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
