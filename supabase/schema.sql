-- =============================================================================
-- ULIS · Supabase — EJECUTAR EN EL SQL EDITOR (Proyecto nuevo recomendado)
-- Orden: pegar completo y ejecutar una sola vez. Luego crear bucket si el INSERT
-- a storage.buckets falla por permisos (en ese caso créalo desde la UI Storage).
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Perfiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Plantillas reutilizables (misma estructura para nuevos proyectos)
-- -----------------------------------------------------------------------------
create table if not exists public.project_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_template_sections (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.project_templates (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  description text,
  unique (template_id, sort_order)
);

create table if not exists public.project_template_documents (
  id uuid primary key default gen_random_uuid(),
  template_section_id uuid not null references public.project_template_sections (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  subtitle text,
  unique (template_section_id, sort_order)
);

-- -----------------------------------------------------------------------------
-- Proyectos (instancias)
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  municipality text,
  department text,
  address text,
  client_name text,
  client_contact text,
  phase_label text,
  macro_state text,
  metadata jsonb not null default '{}'::jsonb,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects (owner_id);

create table if not exists public.project_document_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  description text,
  unique (project_id, sort_order)
);

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  section_id uuid not null references public.project_document_sections (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  subtitle text,
  observations text not null default '',
  status text not null default 'pending' check (status in ('pending', 'review', 'complete')),
  storage_path text,
  file_name text,
  file_mime text,
  file_size bigint,
  uploaded_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (project_id, section_id, sort_order)
);

create index if not exists project_documents_project_idx on public.project_documents (project_id);

-- -----------------------------------------------------------------------------
-- MCN (filas editables por proyecto)
-- -----------------------------------------------------------------------------
create table if not exists public.project_mcn_rows (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sort_order int not null default 0,
  norma text not null default '',
  proyecto text not null default '',
  estado text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Radicación — checklist Decreto 1077 (ítems reales, estado en BD)
-- -----------------------------------------------------------------------------
create table if not exists public.project_rad_checklist_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  is_satisfied boolean not null default false,
  notes text not null default '',
  updated_at timestamptz not null default now(),
  unique (project_id, sort_order)
);

-- -----------------------------------------------------------------------------
-- Diagnóstico — riesgos jurídicos (filas editables)
-- -----------------------------------------------------------------------------
create table if not exists public.project_diagnostico_risks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  level_label text not null default '',
  detail text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Licenciamiento — timeline
-- -----------------------------------------------------------------------------
create table if not exists public.project_lic_timeline_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  state_label text not null default 'Pendiente',
  expected_day_hint int,
  unique (project_id, sort_order)
);

-- -----------------------------------------------------------------------------
-- Análisis normativo — indicadores (editables)
-- -----------------------------------------------------------------------------
create table if not exists public.project_normativo_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade unique,
  pot_cumplimiento_pct int not null default 0,
  acuerdo_0250_note text not null default '',
  ioc_label text not null default '',
  ic_label text not null default '',
  densidad_label text not null default '',
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists trg_project_documents_updated on public.project_documents;
create trigger trg_project_documents_updated
  before update on public.project_documents
  for each row execute function public.set_updated_at();

drop trigger if exists trg_project_mcn_rows_updated on public.project_mcn_rows;
create trigger trg_project_mcn_rows_updated
  before update on public.project_mcn_rows
  for each row execute function public.set_updated_at();

drop trigger if exists trg_project_diagnostico_risks_updated on public.project_diagnostico_risks;
create trigger trg_project_diagnostico_risks_updated
  before update on public.project_diagnostico_risks
  for each row execute function public.set_updated_at();

drop trigger if exists trg_project_normativo_metrics_updated on public.project_normativo_metrics;
create trigger trg_project_normativo_metrics_updated
  before update on public.project_normativo_metrics
  for each row execute function public.set_updated_at();

drop trigger if exists trg_project_rad_checklist_items_updated on public.project_rad_checklist_items;
create trigger trg_project_rad_checklist_items_updated
  before update on public.project_rad_checklist_items
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Clonar plantilla → proyecto (SECURITY DEFINER; usa solo auth.uid() en RPC pública)
-- -----------------------------------------------------------------------------
create or replace function public._clone_template_to_project(
  p_owner uuid,
  p_template_slug text,
  p_name text,
  p_municipality text,
  p_department text,
  p_address text,
  p_client_name text,
  p_client_contact text,
  p_phase_label text,
  p_macro_state text,
  p_metadata jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tmpl uuid;
  v_project uuid;
  r_sec record;
  v_new_sec uuid;
  r_doc record;
begin
  select id into v_tmpl
  from public.project_templates
  where slug = p_template_slug
  limit 1;

  if v_tmpl is null then
    raise exception 'Plantilla % no existe. Ejecute el bloque de seed de plantillas.', p_template_slug;
  end if;

  insert into public.projects (
    owner_id, name, municipality, department, address,
    client_name, client_contact, phase_label, macro_state, metadata
  )
  values (
    p_owner, p_name, p_municipality, p_department, p_address,
    p_client_name, p_client_contact, p_phase_label, p_macro_state, coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_project;

  for r_sec in
    select * from public.project_template_sections
    where template_id = v_tmpl
    order by sort_order
  loop
    insert into public.project_document_sections (project_id, sort_order, title, description)
    values (v_project, r_sec.sort_order, r_sec.title, r_sec.description)
    returning id into v_new_sec;

    for r_doc in
      select * from public.project_template_documents
      where template_section_id = r_sec.id
      order by sort_order
    loop
      insert into public.project_documents (
        project_id, section_id, sort_order, title, subtitle, status, observations
      )
      values (
        v_project, v_new_sec, r_doc.sort_order, r_doc.title, r_doc.subtitle,
        'pending', ''
      );
    end loop;
  end loop;

  perform public._seed_project_modules(v_project);
  return v_project;
end;
$$;

create or replace function public._seed_project_modules(p_project uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_rad_checklist_items (project_id, sort_order, title, is_satisfied, notes)
  values
    (p_project, 1, 'Certificado de libertad y tradición', false, ''),
    (p_project, 2, 'Recibo del último impuesto predial', false, ''),
    (p_project, 3, 'Cámara de comercio de la empresa constructora', false, ''),
    (p_project, 4, 'Documento de identidad del representante legal', false, ''),
    (p_project, 5, 'Escrituras y documentación de propiedad', false, ''),
    (p_project, 6, 'Carta catastral y certificaciones asociadas', false, ''),
    (p_project, 7, 'Plano PUG aprobado y licencias de primera etapa', false, ''),
    (p_project, 8, 'Disponibilidades de servicios públicos vigentes', false, '');

  insert into public.project_lic_timeline_steps (project_id, sort_order, title, state_label, expected_day_hint)
  values
    (p_project, 1, 'Radicación en legal y debida forma', 'Pendiente', 0),
    (p_project, 2, 'Asignación a revisión técnica', 'Pendiente', 5),
    (p_project, 3, 'Concepto técnico intermedio', 'Pendiente', 15),
    (p_project, 4, 'Requerimientos y subsanaciones', 'Pendiente', 30),
    (p_project, 5, 'Resolución de licencia de construcción', 'Pendiente', 45);

  insert into public.project_normativo_metrics (project_id, pot_cumplimiento_pct, acuerdo_0250_note, ioc_label, ic_label, densidad_label)
  values (p_project, 0, '', '', '', '');

  -- MCN y riesgos: sin filas iniciales (el usuario las crea desde la app = datos reales).
end;
$$;

-- RPC: nuevo proyecto desde plantilla (mismo checklist, nombre y datos editables luego)
create or replace function public.create_project_from_template(
  p_name text,
  p_municipality text default null,
  p_department text default null,
  p_address text default null,
  p_client_name text default null,
  p_client_contact text default null,
  p_phase_label text default 'Fase 1 – Recolección Documental',
  p_macro_state text default 'En diagnóstico',
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'No autenticado';
  end if;
  return public._clone_template_to_project(
    v_uid,
    'ulis-default-colombia',
    p_name,
    p_municipality,
    p_department,
    p_address,
    p_client_name,
    p_client_contact,
    p_phase_label,
    p_macro_state,
    p_metadata
  );
end;
$$;

grant execute on function public.create_project_from_template(
  text, text, text, text, text, text, text, text, jsonb
) to authenticated;

-- -----------------------------------------------------------------------------
-- Primer usuario: proyecto Cañaveral – Península (estructura completa, sin archivos)
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  insert into public.profiles (id, full_name)
  values (new.id, v_name)
  on conflict (id) do update set full_name = excluded.full_name;

  if exists (select 1 from public.projects where owner_id = new.id) then
    return new;
  end if;

  perform public._clone_template_to_project(
    new.id,
    'ulis-default-colombia',
    'Cañaveral – Península',
    'Floridablanca',
    'Santander',
    'Calle 36 con Carrera 21 A, barrio Cañaveral',
    'MARDEL CONSTRUCCIONES S.A.',
    'Ing. Ricardo Eliecer Delgado',
    'Fase 1 – Recolección Documental',
    'En diagnóstico',
    jsonb_build_object(
      'subdivision_license', '68276-1-09-0094',
      'subdivision_authority', 'Curaduría Urbana No. 1 de Floridablanca',
      'subdivision_date', '11 de octubre de 2010',
      'consultant_name', 'Roger Alexander Forero Hidalgo',
      'consultant_phone', '300 390 2498',
      'consultant_email', 'foreroullauriarq@gmail.com',
      'consultant_address', 'Carrera 8 A # 12 – 05, Floridablanca – Santander',
      'reference_fee_cop', '$23.250.000 + IVA',
      'proposal_ref_date', '24 de marzo de 2026',
      'consultant_role', 'Mag. Derecho y Gestión Urbanística · Esp. Derecho Urbano · Esp. Planeación Urbana y Regional'
    )
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_document_sections enable row level security;
alter table public.project_documents enable row level security;
alter table public.project_mcn_rows enable row level security;
alter table public.project_rad_checklist_items enable row level security;
alter table public.project_diagnostico_risks enable row level security;
alter table public.project_lic_timeline_steps enable row level security;
alter table public.project_normativo_metrics enable row level security;

-- Plantillas: lectura para usuarios autenticados (para futura UI de plantillas)
alter table public.project_templates enable row level security;
alter table public.project_template_sections enable row level security;
alter table public.project_template_documents enable row level security;

drop policy if exists "profiles_self" on public.profiles;
drop policy if exists "projects_owner_select" on public.projects;
drop policy if exists "projects_owner_insert" on public.projects;
drop policy if exists "projects_owner_update" on public.projects;
drop policy if exists "projects_owner_delete" on public.projects;
drop policy if exists "sections_by_project" on public.project_document_sections;
drop policy if exists "documents_by_project" on public.project_documents;
drop policy if exists "mcn_by_project" on public.project_mcn_rows;
drop policy if exists "rad_by_project" on public.project_rad_checklist_items;
drop policy if exists "diag_risks_by_project" on public.project_diagnostico_risks;
drop policy if exists "lic_by_project" on public.project_lic_timeline_steps;
drop policy if exists "normativo_by_project" on public.project_normativo_metrics;
drop policy if exists "templates_read" on public.project_templates;
drop policy if exists "template_sections_read" on public.project_template_sections;
drop policy if exists "template_docs_read" on public.project_template_documents;

create policy "profiles_self"
  on public.profiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "projects_owner_select"
  on public.projects for select to authenticated
  using (owner_id = auth.uid());

create policy "projects_owner_insert"
  on public.projects for insert to authenticated
  with check (owner_id = auth.uid());

create policy "projects_owner_update"
  on public.projects for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "projects_owner_delete"
  on public.projects for delete to authenticated
  using (owner_id = auth.uid());

create policy "sections_by_project"
  on public.project_document_sections for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "documents_by_project"
  on public.project_documents for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "mcn_by_project"
  on public.project_mcn_rows for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "rad_by_project"
  on public.project_rad_checklist_items for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "diag_risks_by_project"
  on public.project_diagnostico_risks for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "lic_by_project"
  on public.project_lic_timeline_steps for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "normativo_by_project"
  on public.project_normativo_metrics for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "templates_read"
  on public.project_templates for select to authenticated using (true);

create policy "template_sections_read"
  on public.project_template_sections for select to authenticated using (true);

create policy "template_docs_read"
  on public.project_template_documents for select to authenticated using (true);

-- -----------------------------------------------------------------------------
-- Storage: bucket + políticas (ruta: {uid}/{projectId}/{documentId}/{filename})
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

drop policy if exists "storage_project_files_select" on storage.objects;
drop policy if exists "storage_project_files_insert" on storage.objects;
drop policy if exists "storage_project_files_update" on storage.objects;
drop policy if exists "storage_project_files_delete" on storage.objects;

-- Ruta objeto: {auth.uid()}/{project_id}/{document_id}/{nombreArchivo}
create policy "storage_project_files_select"
  on storage.objects for select to authenticated
  using (bucket_id = 'project-files' and split_part(name, '/', 1) = auth.uid()::text);

create policy "storage_project_files_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-files' and split_part(name, '/', 1) = auth.uid()::text);

create policy "storage_project_files_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-files' and split_part(name, '/', 1) = auth.uid()::text);

create policy "storage_project_files_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-files' and split_part(name, '/', 1) = auth.uid()::text);

-- -----------------------------------------------------------------------------
-- SEED: plantilla única + 7 secciones + 34 documentos (solo estructura)
-- -----------------------------------------------------------------------------
delete from public.project_template_documents
where template_section_id in (
  select s.id from public.project_template_sections s
  join public.project_templates t on t.id = s.template_id
  where t.slug = 'ulis-default-colombia'
);
delete from public.project_template_sections
where template_id in (select id from public.project_templates where slug = 'ulis-default-colombia');
delete from public.project_templates where slug = 'ulis-default-colombia';

insert into public.project_templates (slug, name, description)
values (
  'ulis-default-colombia',
  'ULIS · Checklist legal y urbanístico (Colombia)',
  'Estructura base: predio, cargas, catastro, concordancia, normativa, MCN-insumos. Copiable a nuevos proyectos.'
);

-- Variable de plantilla vía CTE
with t as (
  select id as template_id from public.project_templates where slug = 'ulis-default-colombia'
),
s1 as (
  insert into public.project_template_sections (template_id, sort_order, title, description)
  select template_id, 0,
    'Documentos del predio',
    'Cadena registral, matrícula y antecedentes dominiales para trazabilidad del inmueble objeto de consultoría.'
  from t returning id
),
s2 as (
  insert into public.project_template_sections (template_id, sort_order, title, description)
  select template_id, 1,
    'Cargas y limitaciones',
    'Gravámenes, servidumbres y actos que condicionan el ejercicio del dominio y el desarrollo urbanístico.'
  from t returning id
),
s3 as (
  insert into public.project_template_sections (template_id, sort_order, title, description)
  select template_id, 2,
    'Validación catastral',
    'Concordancia geométrica y administrativa con el IGAC y la realidad física del predio.'
  from t returning id
),
s4 as (
  insert into public.project_template_sections (template_id, sort_order, title, description)
  select template_id, 3,
    'Concordancia legal',
    'Cruce catastro–registro y verificación de titulares y superficies para blindaje dominial.'
  from t returning id
),
s5 as (
  insert into public.project_template_sections (template_id, sort_order, title, description)
  select template_id, 4,
    'Normativa base',
    'Corpus normativo estructurante del trámite ante Curaduría y entes de control (Ley 388, NSR, POT y reglamentación sectorial).'
  from t returning id
),
s6 as (
  insert into public.project_template_sections (template_id, sort_order, title, description)
  select template_id, 5,
    'Normativa específica del predio',
    'Instrumentos de planificación y determinantes aplicables al lote (uso, tratamiento, índices y componente ambiental).'
  from t returning id
),
s7 as (
  insert into public.project_template_sections (template_id, sort_order, title, description)
  select template_id, 6,
    'MCN – Insumos',
    'Paquete técnico–jurídico para construcción de la Matriz de Cumplimiento Normativo (MCN) y soporte probatorio del proyecto.'
  from t returning id
)
insert into public.project_template_documents (template_section_id, sort_order, title, subtitle)
select id, 0, 'Certificado de Tradición y Libertad (actualizado)', 'Anotaciones recientes y cadena de transmisiones verificable.' from s1
union all select id, 1, 'Copias de TODAS las escrituras de los últimos 30 años', 'Incluye transmisiones, gravámenes constitutivos y levantamientos.' from s1
union all select id, 2, 'Folio de matrícula inmobiliaria', null from s1
union all select id, 0, 'Certificados de gravámenes (hipotecas, embargos, etc.)', null from s2
union all select id, 1, 'Documentos de servidumbres (si existen)', null from s2
union all select id, 2, 'Actos administrativos que impongan restricciones', null from s2
union all select id, 3, 'Afectaciones (vías, rondas, utilidad pública, etc.)', null from s2
union all select id, 0, 'Certificado catastral actualizado', null from s3
union all select id, 1, 'Ficha predial', null from s3
union all select id, 2, 'Plano catastral', null from s3
union all select id, 3, 'Certificación de cabida y linderos', null from s3
union all select id, 0, 'Comparación catastro vs registro', null from s4
union all select id, 1, 'Verificación de área real vs área registrada', null from s4
union all select id, 2, 'Validación de titulares actuales', null from s4
union all select id, 0, 'POT vigente completo (Floridablanca)', null from s5
union all select id, 1, 'Decreto 068 de 2016', null from s5
union all select id, 2, 'Acuerdo 0250 de 2025 (29 de septiembre de 2025)', null from s5
union all select id, 3, 'Decreto 1077 de 2015', null from s5
union all select id, 4, 'Ley 388 de 1997', null from s5
union all select id, 0, 'Uso del suelo del lote', null from s6
union all select id, 1, 'Tratamiento urbanístico', null from s6
union all select id, 2, 'Ficha normativa del sector', null from s6
union all select id, 3, 'Índices urbanísticos aplicables', null from s6
union all select id, 4, 'Normas ambientales aplicables', null from s6
union all select id, 0, 'Proyecto urbanístico completo', null from s7
union all select id, 1, 'Planos arquitectónicos', null from s7
union all select id, 2, 'Cuadros de áreas', null from s7
union all select id, 3, 'Memorias de diseño', null from s7
union all select id, 4, 'Listado de TODA la normativa aplicable', null from s7
union all select id, 5, 'Cuadro comparativo norma vs proyecto', null from s7
union all select id, 6, 'Identificación de incumplimientos', null from s7
union all select id, 7, 'Justificación técnica/legal de cumplimiento', null from s7
union all select id, 8, 'Jurisprudencia relevante', 'Consejo de Estado y Corte Constitucional — precedentes aplicables.' from s7
union all select id, 9, 'Doctrina o conceptos urbanísticos aplicables', null from s7;

-- Migración suave: si la tabla rad ya existía sin updated_at
alter table public.project_rad_checklist_items
  add column if not exists updated_at timestamptz not null default now();

-- =============================================================================
-- MIGRACIÓN: múltiples archivos por documento (sin romper estructura existente)
-- =============================================================================
create table if not exists public.project_document_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  document_id uuid not null references public.project_documents (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  file_mime text,
  file_size bigint,
  uploaded_at timestamptz not null default now(),
  unique (document_id, storage_path)
);

create index if not exists project_document_files_project_idx
  on public.project_document_files (project_id);
create index if not exists project_document_files_document_idx
  on public.project_document_files (document_id);

alter table public.project_document_files enable row level security;

drop policy if exists "document_files_by_project" on public.project_document_files;
create policy "document_files_by_project"
  on public.project_document_files for all to authenticated
  using (
    exists (
      select 1
      from public.projects p
      where p.id = project_id
        and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.projects p
      where p.id = project_id
        and p.owner_id = auth.uid()
    )
  );

-- backfill desde columnas legacy de project_documents (si había 1 archivo histórico)
insert into public.project_document_files (
  project_id,
  document_id,
  storage_path,
  file_name,
  file_mime,
  file_size,
  uploaded_at
)
select
  d.project_id,
  d.id,
  d.storage_path,
  coalesce(d.file_name, 'archivo'),
  d.file_mime,
  d.file_size,
  coalesce(d.uploaded_at, now())
from public.project_documents d
where d.storage_path is not null
  and not exists (
    select 1
    from public.project_document_files f
    where f.document_id = d.id
      and f.storage_path = d.storage_path
  );

-- =============================================================================
-- NOTAS POST-EJECUCIÓN (en Supabase Dashboard)
-- 1) Authentication → Providers → activar Email.
-- 2) URL de redirect: http://localhost:5173 y su dominio de producción.
-- 3) Si el INSERT a storage.buckets falla, cree el bucket "project-files" (privado)
--    y pegue las mismas políticas RLS sobre storage.objects desde la UI SQL.
-- 4) Variables en el front: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
-- =============================================================================
