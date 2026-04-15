import { supabase } from '@/lib/supabase'
import type { DocStatus, ProjectRow } from '@/types/database'
import type { LegalRiskLevel, ProjectMetrics } from '@/types'
import type {
  ProjectDiagRiskRow,
  ProjectDocumentRow,
  ProjectDocumentSectionRow,
  ProjectLicStepRow,
  ProjectMcnRow,
  ProjectNormativoMetricRow,
  ProjectRadItemRow,
} from '@/types/database'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'

const BUCKET = 'project-files'

export type SectionWithDocs = ProjectDocumentSectionRow & {
  project_documents: ProjectDocumentRow[]
}

function sortDocs(docs: ProjectDocumentRow[]) {
  return [...docs].sort((a, b) => a.sort_order - b.sort_order)
}

function computeMetricsFromDocs(docs: ProjectDocumentRow[]): ProjectMetrics {
  const total = docs.length
  let complete = 0
  let pending = 0
  let review = 0
  let loaded = 0
  for (const d of docs) {
    if (d.status === 'complete') complete++
    if (d.status === 'pending') pending++
    if (d.status === 'review') review++
    if (d.storage_path) loaded++
  }
  const overallProgress =
    total === 0 ? 0 : Math.round((complete / total) * 1000) / 10
  const collectionComplete = total > 0 && complete === total
  let legalRisk: LegalRiskLevel = 'bajo'
  if (overallProgress < 32 || pending > 24) legalRisk = 'alto'
  else if (overallProgress < 68 || review > 11) legalRisk = 'medio'
  const base: ProjectMetrics = {
    total,
    complete,
    pending,
    review,
    loaded,
    overallProgress,
    collectionComplete,
    legalRisk,
  }
  return base
}

function safeStorageFileName(name: string) {
  const trimmed = name.trim().slice(0, 180)
  return trimmed.replace(/[/\\]/g, '_')
}

type ProjectWorkspaceValue = {
  projectId: string
  project: ProjectRow | null
  sections: SectionWithDocs[]
  metrics: ProjectMetrics
  mcnRows: ProjectMcnRow[]
  radItems: ProjectRadItemRow[]
  licSteps: ProjectLicStepRow[]
  normativo: ProjectNormativoMetricRow | null
  diagRisks: ProjectDiagRiskRow[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  setDocStatus: (docId: string, status: DocStatus) => Promise<{ error: string | null }>
  setObservations: (docId: string, text: string) => Promise<{ error: string | null }>
  uploadDocumentFile: (
    docId: string,
    file: File,
    opts?: { onProgress?: (pct: number) => void },
  ) => Promise<{ error: string | null }>
  removeDocumentFile: (docId: string) => Promise<{ error: string | null }>
  getSignedUrl: (storagePath: string) => Promise<string | null>
  addDocumentToSection: (
    sectionId: string,
    title: string,
  ) => Promise<{ error: string | null }>
  addSection: (title: string, description: string) => Promise<{ error: string | null }>
  updateProject: (
    patch: Partial<
      Pick<
        ProjectRow,
        | 'name'
        | 'municipality'
        | 'department'
        | 'address'
        | 'client_name'
        | 'client_contact'
        | 'phase_label'
        | 'macro_state'
      >
    > & { metadata?: ProjectRow['metadata'] },
  ) => Promise<{ error: string | null }>
  addMcnRow: () => Promise<{ error: string | null }>
  updateMcnRow: (
    id: string,
    patch: Partial<Pick<ProjectMcnRow, 'norma' | 'proyecto' | 'estado' | 'sort_order'>>,
  ) => Promise<{ error: string | null }>
  deleteMcnRow: (id: string) => Promise<{ error: string | null }>
  setRadItem: (
    id: string,
    patch: Partial<Pick<ProjectRadItemRow, 'is_satisfied' | 'notes'>>,
  ) => Promise<{ error: string | null }>
  setLicStep: (
    id: string,
    patch: Partial<Pick<ProjectLicStepRow, 'state_label'>>,
  ) => Promise<{ error: string | null }>
  setNormativo: (
    patch: Partial<
      Pick<
        ProjectNormativoMetricRow,
        | 'pot_cumplimiento_pct'
        | 'acuerdo_0250_note'
        | 'ioc_label'
        | 'ic_label'
        | 'densidad_label'
      >
    >,
  ) => Promise<{ error: string | null }>
  addDiagRisk: () => Promise<{ error: string | null }>
  updateDiagRisk: (
    id: string,
    patch: Partial<Pick<ProjectDiagRiskRow, 'title' | 'level_label' | 'detail' | 'sort_order'>>,
  ) => Promise<{ error: string | null }>
  deleteDiagRisk: (id: string) => Promise<{ error: string | null }>
}

const ProjectWorkspaceContext = createContext<ProjectWorkspaceValue | null>(null)

async function clearStorageIfPath(path: string | null) {
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}

export function ProjectWorkspaceProvider() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const [project, setProject] = useState<ProjectRow | null>(null)
  const [sections, setSections] = useState<SectionWithDocs[]>([])
  const [mcnRows, setMcnRows] = useState<ProjectMcnRow[]>([])
  const [radItems, setRadItems] = useState<ProjectRadItemRow[]>([])
  const [licSteps, setLicSteps] = useState<ProjectLicStepRow[]>([])
  const [normativo, setNormativoState] = useState<ProjectNormativoMetricRow | null>(null)
  const [diagRisks, setDiagRisks] = useState<ProjectDiagRiskRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!projectId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    const { data: proj, error: pe } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle()

    if (pe) {
      setError(pe.message)
      setLoading(false)
      return
    }
    if (!proj) {
      setError('Proyecto no encontrado o sin permisos.')
      setProject(null)
      setSections([])
      setLoading(false)
      return
    }

    setProject(proj as ProjectRow)

    const { data: secs, error: se } = await supabase
      .from('project_document_sections')
      .select(
        'id, project_id, sort_order, title, description, project_documents ( id, project_id, section_id, sort_order, title, subtitle, observations, status, storage_path, file_name, file_mime, file_size, uploaded_at, updated_at )',
      )
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })

    if (se) {
      setError(se.message)
    } else {
      const normalized: SectionWithDocs[] = (secs ?? []).map((s) => ({
        ...(s as ProjectDocumentSectionRow),
        project_documents: sortDocs(
          ((s as SectionWithDocs).project_documents ?? []) as ProjectDocumentRow[],
        ),
      }))
      setSections(normalized)
    }

    const [{ data: mcn }, { data: rad }, { data: lic }, { data: nm }, { data: dr }] =
      await Promise.all([
        supabase
          .from('project_mcn_rows')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true }),
        supabase
          .from('project_rad_checklist_items')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true }),
        supabase
          .from('project_lic_timeline_steps')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true }),
        supabase.from('project_normativo_metrics').select('*').eq('project_id', projectId).maybeSingle(),
        supabase
          .from('project_diagnostico_risks')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true }),
      ])

    setMcnRows((mcn ?? []) as ProjectMcnRow[])
    setRadItems((rad ?? []) as ProjectRadItemRow[])
    setLicSteps((lic ?? []) as ProjectLicStepRow[])
    setNormativoState((nm as ProjectNormativoMetricRow | null) ?? null)
    setDiagRisks((dr ?? []) as ProjectDiagRiskRow[])

    setLoading(false)
  }, [projectId])

  useEffect(() => {
    void reload()
  }, [reload])

  const flatDocs = useMemo(
    () => sections.flatMap((s) => s.project_documents),
    [sections],
  )

  const metrics = useMemo(() => computeMetricsFromDocs(flatDocs), [flatDocs])

  const setDocStatus = useCallback(
    async (docId: string, status: DocStatus) => {
      const doc = flatDocs.find((d) => d.id === docId)
      if (!doc) return { error: 'Documento no encontrado' }
      if (status === 'pending' && doc.storage_path) {
        await clearStorageIfPath(doc.storage_path)
        const { error: u } = await supabase
          .from('project_documents')
          .update({
            status,
            storage_path: null,
            file_name: null,
            file_mime: null,
            file_size: null,
            uploaded_at: null,
          })
          .eq('id', docId)
        if (u) return { error: u.message }
      } else {
        const { error: u } = await supabase
          .from('project_documents')
          .update({ status })
          .eq('id', docId)
        if (u) return { error: u.message }
      }
      await reload()
      return { error: null }
    },
    [flatDocs, reload],
  )

  const setObservations = useCallback(
    async (docId: string, text: string) => {
      const { error: u } = await supabase
        .from('project_documents')
        .update({ observations: text })
        .eq('id', docId)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [reload],
  )

  const uploadDocumentFile = useCallback(
    async (docId: string, file: File, opts?: { onProgress?: (pct: number) => void }) => {
      const onProgress = opts?.onProgress
      const doc = flatDocs.find((d) => d.id === docId)
      const uid = (await supabase.auth.getUser()).data.user?.id
      if (!doc || !uid || !projectId)
        return { error: 'Sesión o documento no válidos' }

      if (doc.storage_path) await clearStorageIfPath(doc.storage_path)

      const name = safeStorageFileName(file.name || 'archivo')
      const path = `${uid}/${projectId}/${docId}/${Date.now()}_${name}`

      onProgress?.(4)
      let p = 4
      const tick = window.setInterval(() => {
        p = Math.min(p + 9, 88)
        onProgress?.(p)
      }, 220)

      try {
        const { error: up } = await supabase.storage.from(BUCKET).upload(path, file, {
          upsert: true,
          contentType: file.type || undefined,
        })
        if (up) return { error: up.message }

        onProgress?.(92)

        const { error: db } = await supabase
          .from('project_documents')
          .update({
            storage_path: path,
            file_name: file.name,
            file_mime: file.type || null,
            file_size: file.size,
            uploaded_at: new Date().toISOString(),
            status: 'review',
          })
          .eq('id', docId)

        if (db) {
          await supabase.storage.from(BUCKET).remove([path])
          return { error: db.message }
        }
        onProgress?.(100)
        await reload()
        return { error: null }
      } finally {
        window.clearInterval(tick)
        window.setTimeout(() => onProgress?.(0), 450)
      }
    },
    [flatDocs, projectId, reload],
  )

  const removeDocumentFile = useCallback(
    async (docId: string) => {
      const doc = flatDocs.find((d) => d.id === docId)
      if (!doc?.storage_path) {
        await reload()
        return { error: null }
      }
      await clearStorageIfPath(doc.storage_path)
      const { error: db } = await supabase
        .from('project_documents')
        .update({
          storage_path: null,
          file_name: null,
          file_mime: null,
          file_size: null,
          uploaded_at: null,
        })
        .eq('id', docId)
      if (db) return { error: db.message }
      await reload()
      return { error: null }
    },
    [flatDocs, reload],
  )

  const getSignedUrl = useCallback(async (storagePath: string) => {
    const { data, error: e } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 3600)
    if (e) return null
    return data.signedUrl
  }, [])

  const addDocumentToSection = useCallback(
    async (sectionId: string, title: string) => {
      const sec = sections.find((s) => s.id === sectionId)
      if (!sec || !title.trim()) return { error: 'Sección o título no válido' }
      const max = sec.project_documents.reduce(
        (m, d) => Math.max(m, d.sort_order),
        -1,
      )
      const { error: ins } = await supabase.from('project_documents').insert({
        project_id: projectId,
        section_id: sectionId,
        sort_order: max + 1,
        title: title.trim(),
        status: 'pending',
        observations: '',
      })
      if (ins) return { error: ins.message }
      await reload()
      return { error: null }
    },
    [projectId, sections, reload],
  )

  const addSection = useCallback(
    async (title: string, description: string) => {
      if (!title.trim()) return { error: 'Título requerido' }
      const max = sections.reduce((m, s) => Math.max(m, s.sort_order), -1)
      const { error: ins } = await supabase.from('project_document_sections').insert({
        project_id: projectId,
        sort_order: max + 1,
        title: title.trim(),
        description: description.trim() || null,
      })
      if (ins) return { error: ins.message }
      await reload()
      return { error: null }
    },
    [projectId, sections, reload],
  )

  const updateProject = useCallback(
    async (
      patch: Partial<
        Pick<
          ProjectRow,
          | 'name'
          | 'municipality'
          | 'department'
          | 'address'
          | 'client_name'
          | 'client_contact'
          | 'phase_label'
          | 'macro_state'
        >
      > & { metadata?: ProjectRow['metadata'] },
    ) => {
      const { error: u } = await supabase.from('projects').update(patch).eq('id', projectId)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [projectId, reload],
  )

  const addMcnRow = useCallback(async () => {
    const max = mcnRows.reduce((m, r) => Math.max(m, r.sort_order), -1)
    const { error: u } = await supabase.from('project_mcn_rows').insert({
      project_id: projectId,
      sort_order: max + 1,
      norma: '',
      proyecto: '',
      estado: '',
    })
    if (u) return { error: u.message }
    await reload()
    return { error: null }
  }, [mcnRows, projectId, reload])

  const updateMcnRow = useCallback(
    async (
      id: string,
      patch: Partial<Pick<ProjectMcnRow, 'norma' | 'proyecto' | 'estado' | 'sort_order'>>,
    ) => {
      const { error: u } = await supabase.from('project_mcn_rows').update(patch).eq('id', id)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [reload],
  )

  const deleteMcnRow = useCallback(
    async (id: string) => {
      const { error: u } = await supabase.from('project_mcn_rows').delete().eq('id', id)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [reload],
  )

  const setRadItem = useCallback(
    async (id: string, patch: Partial<Pick<ProjectRadItemRow, 'is_satisfied' | 'notes'>>) => {
      const { error: u } = await supabase
        .from('project_rad_checklist_items')
        .update(patch)
        .eq('id', id)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [reload],
  )

  const setLicStep = useCallback(
    async (id: string, patch: Partial<Pick<ProjectLicStepRow, 'state_label'>>) => {
      const { error: u } = await supabase
        .from('project_lic_timeline_steps')
        .update(patch)
        .eq('id', id)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [reload],
  )

  const setNormativo = useCallback(
    async (
      patch: Partial<
        Pick<
          ProjectNormativoMetricRow,
          | 'pot_cumplimiento_pct'
          | 'acuerdo_0250_note'
          | 'ioc_label'
          | 'ic_label'
          | 'densidad_label'
        >
      >,
    ) => {
      if (!normativo?.id) return { error: 'Métricas normativas no inicializadas' }
      const { error: u } = await supabase
        .from('project_normativo_metrics')
        .update(patch)
        .eq('id', normativo.id)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [normativo, reload],
  )

  const addDiagRisk = useCallback(async () => {
    const max = diagRisks.reduce((m, r) => Math.max(m, r.sort_order), -1)
    const { error: u } = await supabase.from('project_diagnostico_risks').insert({
      project_id: projectId,
      sort_order: max + 1,
      title: 'Nuevo riesgo',
      level_label: '',
      detail: '',
    })
    if (u) return { error: u.message }
    await reload()
    return { error: null }
  }, [diagRisks, projectId, reload])

  const updateDiagRisk = useCallback(
    async (
      id: string,
      patch: Partial<Pick<ProjectDiagRiskRow, 'title' | 'level_label' | 'detail' | 'sort_order'>>,
    ) => {
      const { error: u } = await supabase
        .from('project_diagnostico_risks')
        .update(patch)
        .eq('id', id)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [reload],
  )

  const deleteDiagRisk = useCallback(
    async (id: string) => {
      const { error: u } = await supabase.from('project_diagnostico_risks').delete().eq('id', id)
      if (u) return { error: u.message }
      await reload()
      return { error: null }
    },
    [reload],
  )

  const value = useMemo(
    () => ({
      projectId,
      project,
      sections,
      metrics,
      mcnRows,
      radItems,
      licSteps,
      normativo,
      diagRisks,
      loading,
      error,
      reload,
      setDocStatus,
      setObservations,
      uploadDocumentFile,
      removeDocumentFile,
      getSignedUrl,
      addDocumentToSection,
      addSection,
      updateProject,
      addMcnRow,
      updateMcnRow,
      deleteMcnRow,
      setRadItem,
      setLicStep,
      setNormativo,
      addDiagRisk,
      updateDiagRisk,
      deleteDiagRisk,
    }),
    [
      projectId,
      project,
      sections,
      metrics,
      mcnRows,
      radItems,
      licSteps,
      normativo,
      diagRisks,
      loading,
      error,
      reload,
      setDocStatus,
      setObservations,
      uploadDocumentFile,
      removeDocumentFile,
      getSignedUrl,
      addDocumentToSection,
      addSection,
      updateProject,
      addMcnRow,
      updateMcnRow,
      deleteMcnRow,
      setRadItem,
      setLicStep,
      setNormativo,
      addDiagRisk,
      updateDiagRisk,
      deleteDiagRisk,
    ],
  )

  return (
    <ProjectWorkspaceContext.Provider value={value}>
      <Outlet />
    </ProjectWorkspaceContext.Provider>
  )
}

export function useProjectWorkspace() {
  const ctx = useContext(ProjectWorkspaceContext)
  if (!ctx) throw new Error('useProjectWorkspace debe usarse bajo /p/:projectId')
  return ctx
}
