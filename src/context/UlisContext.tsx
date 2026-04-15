import {
  ALL_DOC_IDS,
  DOCUMENT_SECTIONS,
  type CatalogDoc,
} from '@/data/documentCatalog'
import type { DocStatus, DocumentState, LegalRiskLevel, ProjectMetrics } from '@/types'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'ulis.documentStates.v1'

function buildInitialStates(): Record<string, DocumentState> {
  const map: Record<string, DocumentState> = {}
  for (const section of DOCUMENT_SECTIONS) {
    for (const doc of section.documents) {
      map[doc.id] = {
        status: doc.initialStatus,
        observations: doc.initialObservations ?? '',
        fileName:
          doc.initialStatus === 'complete' || doc.initialStatus === 'review'
            ? `${doc.id}_v1.pdf`
            : undefined,
        uploadedAt:
          doc.initialStatus === 'complete' || doc.initialStatus === 'review'
            ? new Date().toISOString()
            : undefined,
      }
    }
  }
  return map
}

function loadStored(): Record<string, DocumentState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, DocumentState>
    const valid = ALL_DOC_IDS.every((id) => parsed[id])
    return valid ? parsed : null
  } catch {
    return null
  }
}

function computeLegalRisk(metrics: ProjectMetrics): LegalRiskLevel {
  if (metrics.overallProgress < 32 || metrics.pending > 24) return 'alto'
  if (metrics.overallProgress < 68 || metrics.review > 11) return 'medio'
  return 'bajo'
}

function computeMetrics(
  states: Record<string, DocumentState>,
): ProjectMetrics {
  const total = ALL_DOC_IDS.length
  let complete = 0
  let pending = 0
  let review = 0
  let loaded = 0

  for (const id of ALL_DOC_IDS) {
    const s = states[id]
    if (!s) continue
    if (s.status === 'complete') complete++
    if (s.status === 'pending') pending++
    if (s.status === 'review') review++
    if (s.fileName || s.status === 'complete') loaded++
  }

  const overallProgress = Math.round((complete / total) * 1000) / 10
  const collectionComplete = complete === total

  const base: ProjectMetrics = {
    total,
    complete,
    pending,
    review,
    loaded,
    overallProgress,
    collectionComplete,
    legalRisk: 'bajo',
  }
  base.legalRisk = computeLegalRisk(base)
  return base
}

type UlisContextValue = {
  docStates: Record<string, DocumentState>
  metrics: ProjectMetrics
  setDocStatus: (id: string, status: DocStatus) => void
  setObservations: (id: string, text: string) => void
  simulateUpload: (id: string) => void
  resetWorkspace: () => void
  findDocMeta: (id: string) => CatalogDoc | undefined
}

const UlisContext = createContext<UlisContextValue | null>(null)

export function UlisProvider({ children }: { children: ReactNode }) {
  const [docStates, setDocStates] = useState<Record<string, DocumentState>>(() => {
    return loadStored() ?? buildInitialStates()
  })

  const persist = useCallback((next: Record<string, DocumentState>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const setDocStatus = useCallback(
    (id: string, status: DocStatus) => {
      setDocStates((prev) => {
        const cur = prev[id]
        if (!cur) return prev
        const next = {
          ...prev,
          [id]: {
            ...cur,
            status,
            ...(status === 'pending'
              ? { fileName: undefined, uploadedAt: undefined }
              : {}),
          },
        }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const setObservations = useCallback(
    (id: string, text: string) => {
      setDocStates((prev) => {
        const cur = prev[id]
        if (!cur) return prev
        const next = { ...prev, [id]: { ...cur, observations: text } }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const simulateUpload = useCallback(
    (id: string) => {
      const stamp = new Date().toISOString()
      const safeName = `ULIS_${id}_${stamp.slice(0, 10)}.pdf`
      setDocStates((prev) => {
        const cur = prev[id]
        if (!cur) return prev
        const next = {
          ...prev,
          [id]: {
            ...cur,
            fileName: safeName,
            uploadedAt: stamp,
            status: 'review' as DocStatus,
          },
        }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const resetWorkspace = useCallback(() => {
    const fresh = buildInitialStates()
    setDocStates(fresh)
    persist(fresh)
  }, [persist])

  const findDocMeta = useCallback((id: string) => {
    for (const s of DOCUMENT_SECTIONS) {
      const d = s.documents.find((x) => x.id === id)
      if (d) return d
    }
    return undefined
  }, [])

  const metrics = useMemo(() => computeMetrics(docStates), [docStates])

  const value = useMemo(
    () => ({
      docStates,
      metrics,
      setDocStatus,
      setObservations,
      simulateUpload,
      resetWorkspace,
      findDocMeta,
    }),
    [
      docStates,
      metrics,
      setDocStatus,
      setObservations,
      simulateUpload,
      resetWorkspace,
      findDocMeta,
    ],
  )

  return <UlisContext.Provider value={value}>{children}</UlisContext.Provider>
}

export function useUlis() {
  const ctx = useContext(UlisContext)
  if (!ctx) throw new Error('useUlis debe usarse dentro de UlisProvider')
  return ctx
}
