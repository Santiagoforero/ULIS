export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DocStatus = 'pending' | 'review' | 'complete'

export type ProjectRow = {
  id: string
  owner_id: string
  name: string
  municipality: string | null
  department: string | null
  address: string | null
  client_name: string | null
  client_contact: string | null
  phase_label: string | null
  macro_state: string | null
  metadata: Json
  is_archived: boolean
  created_at: string
  updated_at: string
}

export type ProjectDocumentSectionRow = {
  id: string
  project_id: string
  sort_order: number
  title: string
  description: string | null
}

export type ProjectDocumentRow = {
  id: string
  project_id: string
  section_id: string
  sort_order: number
  title: string
  subtitle: string | null
  observations: string
  status: DocStatus
  storage_path: string | null
  file_name: string | null
  file_mime: string | null
  file_size: number | null
  uploaded_at: string | null
  updated_at: string
  project_document_files?: ProjectDocumentFileRow[]
}

export type ProjectDocumentFileRow = {
  id: string
  project_id: string
  document_id: string
  storage_path: string
  file_name: string
  file_mime: string | null
  file_size: number | null
  uploaded_at: string
}

export type ProjectMcnRow = {
  id: string
  project_id: string
  sort_order: number
  norma: string
  proyecto: string
  estado: string
  created_at: string
  updated_at: string
}

export type ProjectRadItemRow = {
  id: string
  project_id: string
  sort_order: number
  title: string
  is_satisfied: boolean
  notes: string
  updated_at: string
}

export type ProjectDiagRiskRow = {
  id: string
  project_id: string
  sort_order: number
  title: string
  level_label: string
  detail: string
  created_at: string
  updated_at: string
}

export type ProjectLicStepRow = {
  id: string
  project_id: string
  sort_order: number
  title: string
  state_label: string
  expected_day_hint: number | null
}

export type ProjectNormativoMetricRow = {
  id: string
  project_id: string
  pot_cumplimiento_pct: number
  acuerdo_0250_note: string
  ioc_label: string
  ic_label: string
  densidad_label: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow
        Insert: {
          id?: string
          owner_id: string
          name: string
          municipality?: string | null
          department?: string | null
          address?: string | null
          client_name?: string | null
          client_contact?: string | null
          phase_label?: string | null
          macro_state?: string | null
          metadata?: Json
          is_archived?: boolean
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      project_document_sections: {
        Row: ProjectDocumentSectionRow
        Insert: {
          id?: string
          project_id: string
          sort_order?: number
          title: string
          description?: string | null
        }
        Update: Partial<Database['public']['Tables']['project_document_sections']['Insert']>
      }
      project_documents: {
        Row: ProjectDocumentRow
        Insert: {
          id?: string
          project_id: string
          section_id: string
          sort_order?: number
          title: string
          subtitle?: string | null
          observations?: string
          status?: DocStatus
          storage_path?: string | null
          file_name?: string | null
          file_mime?: string | null
          file_size?: number | null
          uploaded_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['project_documents']['Insert']>
      }
      project_document_files: {
        Row: ProjectDocumentFileRow
        Insert: {
          id?: string
          project_id: string
          document_id: string
          storage_path: string
          file_name: string
          file_mime?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
        Update: Partial<Database['public']['Tables']['project_document_files']['Insert']>
      }
      project_mcn_rows: {
        Row: ProjectMcnRow
        Insert: {
          id?: string
          project_id: string
          sort_order?: number
          norma?: string
          proyecto?: string
          estado?: string
        }
        Update: Partial<Database['public']['Tables']['project_mcn_rows']['Insert']>
      }
      project_rad_checklist_items: {
        Row: ProjectRadItemRow
        Insert: {
          id?: string
          project_id: string
          sort_order?: number
          title: string
          is_satisfied?: boolean
          notes?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['project_rad_checklist_items']['Insert']>
      }
      project_diagnostico_risks: {
        Row: ProjectDiagRiskRow
        Insert: {
          id?: string
          project_id: string
          sort_order?: number
          title: string
          level_label?: string
          detail?: string
        }
        Update: Partial<Database['public']['Tables']['project_diagnostico_risks']['Insert']>
      }
      project_lic_timeline_steps: {
        Row: ProjectLicStepRow
        Insert: {
          id?: string
          project_id: string
          sort_order?: number
          title: string
          state_label?: string
          expected_day_hint?: number | null
        }
        Update: Partial<Database['public']['Tables']['project_lic_timeline_steps']['Insert']>
      }
      project_normativo_metrics: {
        Row: ProjectNormativoMetricRow
        Insert: {
          id?: string
          project_id: string
          pot_cumplimiento_pct?: number
          acuerdo_0250_note?: string
          ioc_label?: string
          ic_label?: string
          densidad_label?: string
        }
        Update: Partial<Database['public']['Tables']['project_normativo_metrics']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: {
      create_project_from_template: {
        Args: {
          p_name: string
          p_municipality?: string | null
          p_department?: string | null
          p_address?: string | null
          p_client_name?: string | null
          p_client_contact?: string | null
          p_phase_label?: string | null
          p_macro_state?: string | null
          p_metadata?: Json | null
        }
        Returns: string
      }
    }
    Enums: Record<string, never>
  }
}
