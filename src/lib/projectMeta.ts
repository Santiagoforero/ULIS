export const PROJECT = {
  name: 'Cañaveral – Península',
  municipality: 'Floridablanca',
  department: 'Santander',
  address: 'Calle 36 con Carrera 21 A, barrio Cañaveral',
  client: 'MARDEL CONSTRUCCIONES S.A.',
  clientContact: 'Ing. Ricardo Eliecer Delgado',
  phaseLabel: 'Fase 1 – Recolección Documental',
  macroState: 'En diagnóstico',
  subdivisionLicense: '68276-1-09-0094',
  subdivisionAuthority: 'Curaduría Urbana No. 1 de Floridablanca',
  subdivisionDate: '11 de octubre de 2010',
  consultant: 'Roger Alexander Forero Hidalgo',
  consultantRole:
    'Mag. Derecho y Gestión Urbanística · Esp. Derecho Urbano · Esp. Planeación Urbana y Regional',
  consultantPhone: '300 390 2498',
  consultantEmail: 'foreroullauriarq@gmail.com',
  consultantAddress: 'Carrera 8 A # 12 – 05, Floridablanca – Santander',
  proposalRefDate: '24 de marzo de 2026',
  referenceFeeCOP: '$23.250.000 + IVA',
} as const

export const PHASES = [
  { id: 'recoleccion', label: 'Recolección documental', route: '/recoleccion' },
  { id: 'diagnostico', label: 'Diagnóstico legal', route: '/diagnostico' },
  { id: 'normativo', label: 'Análisis normativo', route: '/analisis-normativo' },
  { id: 'mcn', label: 'MCN', route: '/mcn' },
  { id: 'radicacion', label: 'Radicación', route: '/radicacion' },
  { id: 'licenciamiento', label: 'Licenciamiento', route: '/licenciamiento' },
] as const
