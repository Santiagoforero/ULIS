import type { DeliverableDefinition } from '@/lib/deliverablesRegistry'
import type { Json } from '@/types/database'

export type DeliverableFileMeta = {
  storage_path: string
  file_name: string
  file_mime: string | null
  file_size: number | null
  uploaded_at: string
}

export type DeliverableWorksheetState = {
  tables: Record<string, { rows: Array<Record<string, string>> }>
  notes: Record<string, string>
}

export type DeliverablesMetadata = {
  deliverable_worksheets?: Record<string, DeliverableWorksheetState>
  deliverable_final_files?: Record<string, DeliverableFileMeta[]>
}

function asRecord(meta: Json | null | undefined): Record<string, unknown> {
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
    return { ...(meta as Record<string, unknown>) }
  }
  return {}
}

export function parseDeliverablesMetadata(meta: Json | null | undefined): DeliverablesMetadata {
  const r = asRecord(meta)
  const worksheets = r.deliverable_worksheets
  const files = r.deliverable_final_files
  return {
    deliverable_worksheets:
      worksheets && typeof worksheets === 'object' && !Array.isArray(worksheets)
        ? (worksheets as Record<string, DeliverableWorksheetState>)
        : undefined,
    deliverable_final_files:
      files && typeof files === 'object' && !Array.isArray(files)
        ? (files as Record<string, DeliverableFileMeta[]>)
        : undefined,
  }
}

function emptyRow(columns: string[]): Record<string, string> {
  const o: Record<string, string> = {}
  for (const c of columns) o[c] = ''
  return o
}

export function getWorksheetState(
  meta: Json | null | undefined,
  def: DeliverableDefinition,
): DeliverableWorksheetState {
  const parsed = parseDeliverablesMetadata(meta)
  const raw = parsed.deliverable_worksheets?.[def.id]
  const tables: Record<string, { rows: Array<Record<string, string>> }> = {}
  for (const t of def.tables) {
    const colKeys = t.columns.map((c) => c.key)
    const existing = raw?.tables?.[t.key]?.rows
    if (Array.isArray(existing) && existing.length > 0) {
      tables[t.key] = {
        rows: existing.map((row) => {
          const next = { ...emptyRow(colKeys) }
          for (const k of colKeys) {
            if (typeof row[k] === 'string') next[k] = row[k]
          }
          return next
        }),
      }
    } else {
      tables[t.key] = { rows: [emptyRow(colKeys)] }
    }
  }
  const notes: Record<string, string> = {}
  for (const n of def.noteSections) {
    const v = raw?.notes?.[n.key]
    notes[n.key] = typeof v === 'string' ? v : ''
  }
  return { tables, notes }
}

function countFilledCells(rows: Array<Record<string, string>>): { filled: number; total: number } {
  let filled = 0
  let total = 0
  for (const row of rows) {
    for (const v of Object.values(row)) {
      total++
      if (v.trim().length > 0) filled++
    }
  }
  return { filled, total }
}

export function computeDeliverableProgress(
  def: DeliverableDefinition,
  state: DeliverableWorksheetState,
  finalFiles: DeliverableFileMeta[] | undefined,
): number {
  let filled = 0
  let total = 0
  for (const t of def.tables) {
    const rows = state.tables[t.key]?.rows ?? []
    const c = countFilledCells(rows)
    filled += c.filled
    total += Math.max(c.total, 1)
  }
  for (const n of def.noteSections) {
    total += 4
    const text = (state.notes[n.key] ?? '').trim()
    filled += Math.min(4, text.length > 0 ? 3 + Math.min(1, Math.floor(text.length / 200)) : 0)
  }
  total += 5
  if (finalFiles && finalFiles.length > 0) filled += 5
  const pct = total === 0 ? 0 : Math.round((filled / total) * 1000) / 10
  return Math.min(100, pct)
}

export function mergeDeliverablesIntoMetadata(
  base: Json | null | undefined,
  patch: Partial<DeliverablesMetadata>,
): Json {
  const r = asRecord(base)
  if (patch.deliverable_worksheets !== undefined) {
    r.deliverable_worksheets = {
      ...(typeof r.deliverable_worksheets === 'object' &&
      r.deliverable_worksheets &&
      !Array.isArray(r.deliverable_worksheets)
        ? r.deliverable_worksheets
        : {}),
      ...patch.deliverable_worksheets,
    }
  }
  if (patch.deliverable_final_files !== undefined) {
    r.deliverable_final_files = {
      ...(typeof r.deliverable_final_files === 'object' &&
      r.deliverable_final_files &&
      !Array.isArray(r.deliverable_final_files)
        ? r.deliverable_final_files
        : {}),
      ...patch.deliverable_final_files,
    }
  }
  return r as Json
}
