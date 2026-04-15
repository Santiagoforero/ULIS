export type { DocStatus } from '@/types/database'

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
