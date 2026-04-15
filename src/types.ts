export type DocStatus = 'pending' | 'review' | 'complete'

export type DocumentState = {
  status: DocStatus
  fileName?: string
  uploadedAt?: string
  observations: string
}

export type LegalRiskLevel = 'bajo' | 'medio' | 'alto'

export type ProjectMetrics = {
  total: number
  complete: number
  pending: number
  review: number
  loaded: number
  overallProgress: number
  collectionComplete: boolean
  legalRisk: LegalRiskLevel
}
