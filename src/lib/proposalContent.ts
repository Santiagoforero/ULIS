/** Propuesta Cañaveral – Península: referencia contractual en la app. */

export const proposalMeta = {
  client: 'MARDEL CONSTRUCCIONES S.A.',
  contactName: 'Ing. Ricardo Eliecer Delgado',
  project: 'Cañaveral – Península',
  municipality: 'Floridablanca',
  consultant: 'ARQ. Roger Alexander Forero Hidalgo',
  proposalDate: '24 de marzo de 2026',
  licenseRef: '68276-1-09-0094 (11 oct 2010)',
  costCOP: 23_250_000,
  costLabel: '$23.250.000 + IVA',
} as const

export type ProposalChecklistId =
  | 'mcn'
  | 'concepto_juridico'
  | 'estudio_titulos'
  | 'due_diligence'
  | 'plan_contingencia'
  | 'radicacion_legal'
  | 'seguimiento_curaduria'
  | 'informe_seguimiento'

export const proposalChecklistItems: {
  id: ProposalChecklistId
  label: string
  hint: string
  route: string
}[] = [
  {
    id: 'mcn',
    label: 'Matriz de Cumplimiento Normativo (MCN)',
    hint: 'Cruce artículo por artículo POT, Decreto 1077 y normativa complementaria.',
    route: 'mcn',
  },
  {
    id: 'concepto_juridico',
    label: 'Concepto jurídico de viabilidad',
    hint: 'Fundamentos, riesgos y recomendaciones vinculantes.',
    route: 'diagnostico',
  },
  {
    id: 'estudio_titulos',
    label: 'Estudio de títulos',
    hint: 'Cadena dominial, gravámenes y consistencia registral.',
    route: 'diagnostico',
  },
  {
    id: 'due_diligence',
    label: 'Informe de due diligence inmobiliaria',
    hint: 'Consolidación de hallazgos y riesgos del expediente.',
    route: 'reportes',
  },
  {
    id: 'plan_contingencia',
    label: 'Plan de contingencia jurídica',
    hint: 'Estrategia de recursos y oposiciones.',
    route: 'reportes',
  },
  {
    id: 'radicacion_legal',
    label: 'Radicación en legal y debida forma',
    hint: 'Checklist Decreto 1077 y soporte documental.',
    route: 'radicacion',
  },
  {
    id: 'seguimiento_curaduria',
    label: 'Seguimiento Curaduría / licenciamiento',
    hint: 'Timeline, hitos y estados del trámite.',
    route: 'licenciamiento',
  },
  {
    id: 'informe_seguimiento',
    label: 'Informe de seguimiento jurídico (referencia)',
    hint: 'Registro quincenal de radicados y constancias.',
    route: 'reportes',
  },
]

export const methodologyBlocks = [
  {
    title: 'Revisión de documentos y normativas',
    points: [
      'Alineación con POT vigente, Acuerdo 0250/2025 y Decreto 068/2016.',
      'Revisión de cadena dominial (30 años), gravámenes y CTL con anotaciones recientes.',
    ],
  },
  {
    title: 'Estudio de títulos y revisión urbanística',
    points: [
      'IOC, IC, densidad, determinantes ambientales, cesiones, cargas VIP y usos del suelo.',
    ],
  },
  {
    title: 'Estudios técnicos',
    points: [
      'Completitud y rigor de estudios exigidos por Curaduría (urbano, estructural, suelos, servicios).',
    ],
  },
  {
    title: 'Radicación y licenciamiento',
    points: [
      'Coordinación documental para radicación en debida forma y seguimiento hasta resolución.',
    ],
  },
] as const

export const paymentSchedule = [
  { pct: 50, milestone: 'Inicio del contrato' },
  { pct: 25, milestone: 'Radicación en legal y debida forma' },
  { pct: 25, milestone: 'Entrega de la licencia de construcción' },
] as const

export const timelineWeeks = [
  { name: 'Etapa 1 · Estudio y viabilidad', weeks: 4 },
  { name: 'Etapa 2 · Radicación', weeks: 1 },
  { name: 'Etapa 3 · Aprobación licencia', weeks: 6 },
] as const
