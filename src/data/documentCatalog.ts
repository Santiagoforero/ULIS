import type { DocStatus } from '@/types'

export type CatalogDoc = {
  id: string
  title: string
  subtitle?: string
  initialStatus: DocStatus
  initialObservations?: string
}

export type CatalogSection = {
  id: string
  title: string
  description: string
  documents: CatalogDoc[]
}

export const DOCUMENT_SECTIONS: CatalogSection[] = [
  {
    id: 'predio',
    title: 'Documentos del predio',
    description:
      'Cadena registral, matrícula y antecedentes dominiales para trazabilidad del inmueble objeto de consultoría.',
    documents: [
      {
        id: 'ctl',
        title: 'Certificado de Tradición y Libertad (actualizado)',
        subtitle: 'Anotaciones recientes y cadena de transmisiones verificable.',
        initialStatus: 'review',
        initialObservations:
          'Solicitud de CTL con anotaciones últimos 10 años — pendiente validación de anotaciones posteriores a subdivisión.',
      },
      {
        id: 'escrituras-30',
        title: 'Copias de TODAS las escrituras de los últimos 30 años',
        subtitle: 'Incluye transmisiones, gravámenes constitutivos y levantamientos.',
        initialStatus: 'pending',
      },
      {
        id: 'folio-matricula',
        title: 'Folio de matrícula inmobiliaria',
        initialStatus: 'complete',
        initialObservations: 'Matrícula verificada contra subdivisión 68276-1-09-0094.',
      },
    ],
  },
  {
    id: 'cargas',
    title: 'Cargas y limitaciones',
    description:
      'Gravámenes, servidumbres y actos que condicionan el ejercicio del dominio y el desarrollo urbanístico.',
    documents: [
      {
        id: 'gravamenes',
        title: 'Certificados de gravámenes (hipotecas, embargos, etc.)',
        initialStatus: 'pending',
      },
      {
        id: 'servidumbres',
        title: 'Documentos de servidumbres (si existen)',
        initialStatus: 'pending',
      },
      {
        id: 'actos-admin',
        title: 'Actos administrativos que impongan restricciones',
        initialStatus: 'review',
      },
      {
        id: 'afectaciones',
        title: 'Afectaciones (vías, rondas, utilidad pública, etc.)',
        initialStatus: 'pending',
      },
    ],
  },
  {
    id: 'catastral',
    title: 'Validación catastral',
    description:
      'Concordancia geométrica y administrativa con el IGAC y la realidad física del predio.',
    documents: [
      {
        id: 'cert-catastral',
        title: 'Certificado catastral actualizado',
        initialStatus: 'complete',
      },
      {
        id: 'ficha-predial',
        title: 'Ficha predial',
        initialStatus: 'review',
      },
      {
        id: 'plano-catastral',
        title: 'Plano catastral',
        initialStatus: 'pending',
      },
      {
        id: 'cabida-linderos',
        title: 'Certificación de cabida y linderos',
        initialStatus: 'pending',
      },
    ],
  },
  {
    id: 'concordancia',
    title: 'Concordancia legal',
    description:
      'Cruce catastro–registro y verificación de titulares y superficies para blindaje dominial.',
    documents: [
      {
        id: 'catastro-vs-registro',
        title: 'Comparación catastro vs registro',
        initialStatus: 'pending',
      },
      {
        id: 'area-real-vs-registrada',
        title: 'Verificación de área real vs área registrada',
        initialStatus: 'pending',
      },
      {
        id: 'titulares-actuales',
        title: 'Validación de titulares actuales',
        initialStatus: 'review',
      },
    ],
  },
  {
    id: 'normativa-base',
    title: 'Normativa base',
    description:
      'Corpus normativo estructurante del trámite ante Curaduría y entes de control (Ley 388, NSR, POT y reglamentación sectorial).',
    documents: [
      {
        id: 'pot',
        title: 'POT vigente completo (Floridablanca)',
        initialStatus: 'complete',
      },
      {
        id: 'decreto-068',
        title: 'Decreto 068 de 2016',
        initialStatus: 'complete',
      },
      {
        id: 'acuerdo-0250',
        title: 'Acuerdo 0250 de 2025 (29 de septiembre de 2025)',
        initialStatus: 'review',
      },
      {
        id: 'decreto-1077',
        title: 'Decreto 1077 de 2015',
        initialStatus: 'complete',
      },
      {
        id: 'ley-388',
        title: 'Ley 388 de 1997',
        initialStatus: 'complete',
      },
    ],
  },
  {
    id: 'normativa-especifica',
    title: 'Normativa específica del predio',
    description:
      'Instrumentos de planificación y determinantes aplicables al lote (uso, tratamiento, índices y componente ambiental).',
    documents: [
      {
        id: 'uso-suelo',
        title: 'Uso del suelo del lote',
        initialStatus: 'review',
      },
      {
        id: 'tratamiento-urbanistico',
        title: 'Tratamiento urbanístico',
        initialStatus: 'pending',
      },
      {
        id: 'ficha-normativa',
        title: 'Ficha normativa del sector',
        initialStatus: 'pending',
      },
      {
        id: 'indices-urbanisticos',
        title: 'Índices urbanísticos aplicables',
        initialStatus: 'pending',
      },
      {
        id: 'normas-ambientales',
        title: 'Normas ambientales aplicables',
        initialStatus: 'pending',
      },
    ],
  },
  {
    id: 'mcn-insumos',
    title: 'MCN – Insumos',
    description:
      'Paquete técnico–jurídico para construcción de la Matriz de Cumplimiento Normativo (MCN) y soporte probatorio del proyecto.',
    documents: [
      {
        id: 'proyecto-urbanistico',
        title: 'Proyecto urbanístico completo',
        initialStatus: 'pending',
      },
      {
        id: 'planos-arq',
        title: 'Planos arquitectónicos',
        initialStatus: 'pending',
      },
      {
        id: 'cuadros-areas',
        title: 'Cuadros de áreas',
        initialStatus: 'pending',
      },
      {
        id: 'memorias-diseno',
        title: 'Memorias de diseño',
        initialStatus: 'pending',
      },
      {
        id: 'listado-normativa',
        title: 'Listado de TODA la normativa aplicable',
        initialStatus: 'pending',
      },
      {
        id: 'cuadro-comparativo',
        title: 'Cuadro comparativo norma vs proyecto',
        initialStatus: 'pending',
      },
      {
        id: 'incumplimientos',
        title: 'Identificación de incumplimientos',
        initialStatus: 'pending',
      },
      {
        id: 'justificacion',
        title: 'Justificación técnica/legal de cumplimiento',
        initialStatus: 'pending',
      },
      {
        id: 'jurisprudencia',
        title: 'Jurisprudencia relevante',
        subtitle: 'Consejo de Estado y Corte Constitucional — precedentes aplicables.',
        initialStatus: 'pending',
      },
      {
        id: 'doctrina',
        title: 'Doctrina o conceptos urbanísticos aplicables',
        initialStatus: 'pending',
      },
    ],
  },
]

export const ALL_DOC_IDS = DOCUMENT_SECTIONS.flatMap((s) =>
  s.documents.map((d) => d.id),
)

export const TOTAL_REQUIRED_DOCS = ALL_DOC_IDS.length
