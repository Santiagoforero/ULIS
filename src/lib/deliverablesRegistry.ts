/**
 * Catálogo de entregables contractuales (propuesta Cañaveral – Península).
 * Cada ítem define metodología, plantillas tabulares y notas para el taller en app.
 */

export type DeliverableId =
  | 'mcn'
  | 'concepto_juridico'
  | 'estudio_titulos'
  | 'due_diligence'
  | 'fase2_viabilidad'
  | 'plan_contingencia'
  | 'radicacion_paquete'
  | 'seguimiento_curaduria'
  | 'informe_seguimiento_quincenal'

export type DeliverableTableColumn = { key: string; label: string }

export type DeliverableTableDef = {
  key: string
  title: string
  description: string
  columns: DeliverableTableColumn[]
}

export type DeliverableNoteSection = {
  key: string
  title: string
  placeholder: string
}

export type DeliverableDefinition = {
  id: DeliverableId
  title: string
  shortLabel: string
  phase: 'I' | 'II' | 'III'
  phaseLabel: string
  proposalRef: string
  /** Ruta relativa bajo /p/:id/ (ej. mcn, radicacion) */
  relatedModule?: string
  methodology: { title: string; steps: string[] }[]
  tables: DeliverableTableDef[]
  noteSections: DeliverableNoteSection[]
}

export const deliverables: DeliverableDefinition[] = [
  {
    id: 'mcn',
    title: 'Matriz de Cumplimiento Normativo (MCN)',
    shortLabel: 'MCN',
    phase: 'I',
    phaseLabel: 'Etapa I · Fase 1',
    proposalRef: 'Cruce artículo por artículo POT 2016, Decreto 1077/2015 y normas urbanísticas.',
    relatedModule: 'mcn',
    methodology: [
      {
        title: 'Cómo se construye',
        steps: [
          'Identifique el instrumento (POT, acuerdos, Decreto 1077) y el artículo o determinante exacto.',
          'Describa cómo el proyecto materializa (lote, volumetría, índices, tratamiento) la exigencia.',
          'Indique estado: cumple, cumple con observación, no cumple, o no aplica — con justificación breve.',
          'Cruce con recolección: adjunte o cite en observaciones el soporte en expediente.',
        ],
      },
      {
        title: 'Criterios de calidad',
        steps: [
          'Evite filas genéricas: cada norma debe ser verificable y trazable a plano o estudio.',
          'Marque riesgos de fondo (densidad, cesiones, redes) y remítalos al diagnóstico legal si aplica.',
        ],
      },
    ],
    tables: [
      {
        key: 'cruce_normativa',
        title: 'Cruce normativo (plantilla)',
        description:
          'Use esta tabla para borrador; la MCN operativa en base de datos sigue en el módulo MCN.',
        columns: [
          { key: 'instrumento', label: 'Instrumento / artículo' },
          { key: 'exigencia', label: 'Exigencia' },
          { key: 'proyecto', label: 'Cómo lo resuelve el proyecto' },
          { key: 'estado', label: 'Estado / observación' },
          { key: 'soporte', label: 'Soporte en expediente' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'hallazgos',
        title: 'Hallazgos y decisiones',
        placeholder: 'Síntesis de vacíos, requerimientos de reformulación, reuniones con Curaduría…',
      },
    ],
  },
  {
    id: 'concepto_juridico',
    title: 'Concepto jurídico de viabilidad',
    shortLabel: 'Concepto jurídico',
    phase: 'I',
    phaseLabel: 'Etapa I · Fase 1',
    proposalRef: 'Documento anexo al informe técnico; firmado por abogado; riesgos y recomendaciones vinculantes.',
    relatedModule: 'diagnostico',
    methodology: [
      {
        title: 'Estructura sugerida',
        steps: [
          'Hechos probados (predio, actos administrativos, licencia de subdivisión 68276-1-09-0094).',
          'Marco jurídico aplicable (Ley 388, POT, procedimiento ante Curaduría).',
          'Análisis: títulos, cargas, procedimiento, riesgos de nulidad o revocatoria.',
          'Conclusión: viabilidad condicionada o plena, con lista de condiciones.',
        ],
      },
      {
        title: 'Matriz de riesgos',
        steps: [
          'Relacione cada riesgo con precedentes Consejo de Estado / Corte Constitucional cuando aplique.',
          'Vincule riesgos con filas del módulo Diagnóstico legal (no duplicar sin trazabilidad).',
        ],
      },
    ],
    tables: [
      {
        key: 'preguntas_juridicas',
        title: 'Cuestiones jurídicas',
        description: 'Una fila por tema: dominio, procedimiento, competencia, términos, etc.',
        columns: [
          { key: 'tema', label: 'Tema' },
          { key: 'fundamento', label: 'Fundamento / norma' },
          { key: 'analisis', label: 'Análisis' },
          { key: 'conclusion', label: 'Conclusión' },
        ],
      },
      {
        key: 'precedentes',
        title: 'Precedentes y jurisprudencia',
        description: 'Referencia breve y aplicación al caso.',
        columns: [
          { key: 'sentencia', label: 'Acto / sentencia' },
          { key: 'tesis', label: 'Tesis relevante' },
          { key: 'aplicacion', label: 'Aplicación al proyecto' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'condiciones',
        title: 'Condiciones y recomendaciones vinculantes',
        placeholder: 'Lista numerada de condiciones para aprobación sin observaciones de fondo…',
      },
    ],
  },
  {
    id: 'estudio_titulos',
    title: 'Estudio de títulos',
    shortLabel: 'Estudio de títulos',
    phase: 'I',
    phaseLabel: 'Etapa I · Fase 1',
    proposalRef: 'Cadena dominial 30 años, gravámenes, servidumbres, CTL y concordancia catastral.',
    relatedModule: 'diagnostico',
    methodology: [
      {
        title: 'Secuencia',
        steps: [
          'Levante cadena desde documentos en recolección (escrituras, CTL, certificados).',
          'Verifique identidad de predio: matrícula, chip, cédula catastral.',
          'Registre gravámenes, hipotecas, embargos, servidumbres, limitaciones al dominio.',
          'Conclusión sobre capacidad de desarrollo y necesidad de levantamiento o cancelación.',
        ],
      },
    ],
    tables: [
      {
        key: 'cadena',
        title: 'Cadena de titulación',
        description: 'Una fila por acto o escritura relevante.',
        columns: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'acto', label: 'Acto / escritura' },
          { key: 'matricula', label: 'Matrícula' },
          { key: 'comparece', label: 'Comparecientes' },
          { key: 'notas', label: 'Gravámenes / limitaciones' },
        ],
      },
      {
        key: 'catastral',
        title: 'Concordancia catastral',
        description: 'Cruce carta catastral, plano y registro.',
        columns: [
          { key: 'dato', label: 'Dato' },
          { key: 'catastro', label: 'Catastro' },
          { key: 'registro', label: 'Registro' },
          { key: 'obs', label: 'Observación' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'conclusion',
        title: 'Conclusión sobre dominio',
        placeholder: 'Síntesis: titulidad suficiente para licenciar, condiciones, pendientes…',
      },
    ],
  },
  {
    id: 'due_diligence',
    title: 'Informe de due diligence inmobiliaria',
    shortLabel: 'Due diligence',
    phase: 'I',
    phaseLabel: 'Etapa I · Fase 1',
    proposalRef: 'Consolidación de hallazgos técnicos, jurídicos y administrativos del expediente.',
    relatedModule: 'reportes',
    methodology: [
      {
        title: 'Enfoque',
        steps: [
          'Resuma estado de recolección y calidad de documentos.',
          'Integre MCN, títulos, riesgos y análisis normativo en un solo mapa de riesgos.',
          'Indique acciones correctivas antes de radicar.',
        ],
      },
    ],
    tables: [
      {
        key: 'riesgos_expediente',
        title: 'Mapa de riesgos',
        description: 'Riesgo × impacto × mitigación.',
        columns: [
          { key: 'riesgo', label: 'Riesgo' },
          { key: 'origen', label: 'Origen / módulo' },
          { key: 'impacto', label: 'Impacto' },
          { key: 'mitigacion', label: 'Mitigación' },
          { key: 'responsable', label: 'Responsable' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'resumen_ejecutivo',
        title: 'Resumen ejecutivo',
        placeholder: 'Una página para cliente: hallazgos críticos y próximos pasos…',
      },
    ],
  },
  {
    id: 'fase2_viabilidad',
    title: 'Informe Fase 2 · recomendaciones y ajustes de viabilidad',
    shortLabel: 'Informe Fase 2',
    phase: 'I',
    phaseLabel: 'Etapa I · Fase 2',
    proposalRef:
      'Estrategias prácticas para áreas de mejora; optimización de diseño y cumplimiento normativo.',
    relatedModule: 'analisis-normativo',
    methodology: [
      {
        title: 'Contenido',
        steps: [
          'Síntesis de hallazgos de Fase 1 (no repetir el informe completo).',
          'Recomendaciones priorizadas: impacto × esfuerzo × plazo.',
          'Plan de implementación con responsables y fechas.',
        ],
      },
    ],
    tables: [
      {
        key: 'recomendaciones',
        title: 'Recomendaciones priorizadas',
        description: 'Una fila por medida de mejora.',
        columns: [
          { key: 'area', label: 'Área / tema' },
          { key: 'hallazgo', label: 'Hallazgo' },
          { key: 'accion', label: 'Acción recomendada' },
          { key: 'prioridad', label: 'Prioridad' },
          { key: 'plazo', label: 'Plazo' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'estrategia',
        title: 'Estrategia de cierre',
        placeholder: 'Cómo se obtiene la viabilidad sin alargar el trámite…',
      },
    ],
  },
  {
    id: 'plan_contingencia',
    title: 'Plan de contingencia jurídica',
    shortLabel: 'Plan contingencia',
    phase: 'I',
    phaseLabel: 'Etapa I · transversal',
    proposalRef:
      'Recursos de reposición y apelación ante Curaduría y/o Alcaldía; oposiciones de terceros.',
    relatedModule: 'reportes',
    methodology: [
      {
        title: 'Diseño del plan',
        steps: [
          'Identifique escenarios: desistimiento, rechazo, observaciones, oposición, nulidad.',
          'Para cada escenario: plazos, competencia, pruebas y estrategia procesal.',
          'Defina canales de comunicación con cliente y constructora.',
        ],
      },
    ],
    tables: [
      {
        key: 'escenarios',
        title: 'Escenarios y respuesta',
        description: 'Qué hacer si ocurre X.',
        columns: [
          { key: 'escenario', label: 'Escenario' },
          { key: 'plazo', label: 'Plazo legal' },
          { key: 'actuacion', label: 'Actuación' },
          { key: 'soporte', label: 'Soporte / prueba' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'equipo',
        title: 'Roles y contactos',
        placeholder: 'Quién radica, quién firma, quién notifica…',
      },
    ],
  },
  {
    id: 'radicacion_paquete',
    title: 'Radicación en legal y debida forma (paquete Curaduría)',
    shortLabel: 'Radicación',
    phase: 'II',
    phaseLabel: 'Etapa II',
    proposalRef:
      'Decreto 1077/2015 (texto citado en propuesta como 2005 — verificar versión aplicable al trámite). Documentación jurídica y técnica.',
    relatedModule: 'radicacion',
    methodology: [
      {
        title: 'Compilación',
        steps: [
          'Liste ítems exigidos por normativa vigente y complete la verificación en el módulo Radicación.',
          'Asegure disponibilidades de servicios (agua, alcantarillado, energía) vigentes.',
          'Organice índice electrónico y orden de anexos según instructivo de la entidad.',
        ],
      },
    ],
    tables: [
      {
        key: 'juridicos',
        title: 'Documentos jurídicos',
        description: 'CTL, impuesto predial, cámara de comercio, ID, escritura, carta catastral, PUG, licencias previas, etc.',
        columns: [
          { key: 'documento', label: 'Documento' },
          { key: 'estado', label: 'Estado' },
          { key: 'radicado', label: 'Nº radicado / anexo' },
          { key: 'obs', label: 'Observación' },
        ],
      },
      {
        key: 'tecnicos',
        title: 'Proyecto y estudios técnicos',
        description: 'Arquitectura, estructural, suelos, NSR-10, coherencia con POT.',
        columns: [
          { key: 'entrega', label: 'Entrega' },
          { key: 'responsable', label: 'Responsable' },
          { key: 'vigencia', label: 'Vigencia / versión' },
          { key: 'obs', label: 'Observación' },
        ],
      },
      {
        key: 'servicios',
        title: 'Disponibilidad de servicios',
        description: 'Requisito primordial para licencia en tratamiento de desarrollo.',
        columns: [
          { key: 'servicio', label: 'Servicio' },
          { key: 'certificado', label: 'Certificado / fecha' },
          { key: 'obs', label: 'Observación' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'logistica',
        title: 'Citas y logística de radicación',
        placeholder: 'Fecha tentativa, ventanilla, requerimientos de formato…',
      },
    ],
  },
  {
    id: 'seguimiento_curaduria',
    title: 'Seguimiento ante Curaduría (hasta licencia)',
    shortLabel: 'Seguimiento',
    phase: 'III',
    phaseLabel: 'Etapa III',
    proposalRef:
      'Seguimiento 45 días hábiles (referencia legal); reuniones, subsanaciones y constancias.',
    relatedModule: 'licenciamiento',
    methodology: [
      {
        title: 'Operación',
        steps: [
          'Registre cada estado en el timeline del módulo Licenciamiento.',
          'Por cada requerimiento: fecha, sustento y respuesta radicada.',
          'Evite desistimiento por errores procedimentales: plazos y formato.',
        ],
      },
    ],
    tables: [
      {
        key: 'requerimientos',
        title: 'Requerimientos y respuestas',
        description: 'Una fila por comunicación oficial.',
        columns: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'resumen', label: 'Resumen' },
          { key: 'respuesta', label: 'Respuesta / radicado' },
          { key: 'estado', label: 'Estado' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'reuniones',
        title: 'Reuniones y acuerdos',
        placeholder: 'Actas, compromisos, próximos hitos…',
      },
    ],
  },
  {
    id: 'informe_seguimiento_quincenal',
    title: 'Informe de seguimiento jurídico (referencia quincenal)',
    shortLabel: 'Informe quincenal',
    phase: 'III',
    phaseLabel: 'Etapa III',
    proposalRef:
      'Entrega al cliente con copia de radicados y constancias de trámite (según propuesta).',
    relatedModule: 'reportes',
    methodology: [
      {
        title: 'Periodicidad',
        steps: [
          'Cada quincena: estado del trámite, alertas, próximos vencimientos.',
          'Adjunte constancias y copias de radicados en el entregable final o en recolección.',
        ],
      },
    ],
    tables: [
      {
        key: 'periodos',
        title: 'Periodos reportados',
        description: 'Una fila por quincena o por informe.',
        columns: [
          { key: 'periodo', label: 'Periodo' },
          { key: 'avance', label: 'Avance' },
          { key: 'riesgos', label: 'Riesgos / alertas' },
          { key: 'proximos', label: 'Próximos pasos' },
        ],
      },
    ],
    noteSections: [
      {
        key: 'anexos',
        title: 'Lista de anexos enviados al cliente',
        placeholder: 'Radicados, constancias, comunicaciones…',
      },
    ],
  },
]

export const deliverablesById: Record<DeliverableId, DeliverableDefinition> = Object.fromEntries(
  deliverables.map((d) => [d.id, d]),
) as Record<DeliverableId, DeliverableDefinition>

export function isDeliverableId(id: string): id is DeliverableId {
  return id in deliverablesById
}
