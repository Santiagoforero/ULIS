import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IndeterminateProgress } from '@/components/IndeterminateProgress'
import { NoticeBanner } from '@/components/NoticeBanner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useNotice } from '@/hooks/useNotice'
import { supabase } from '@/lib/supabase'
import type { ProjectRow } from '@/types/database'
import { FolderOpen, LogOut, Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function ProjectsPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { notice, showError, showSuccess, clear } = useNotice()
  const [rows, setRows] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.id)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
    if (error) {
      setErr(error.message)
      showError(error.message)
    } else {
      setErr(null)
      clear()
      setRows((data ?? []) as ProjectRow[])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setErr(null)
    clear()
    const { data, error } = await supabase.rpc('create_project_from_template', {
      p_name: newName.trim(),
      p_municipality: null,
      p_department: null,
      p_address: null,
      p_client_name: null,
      p_client_contact: null,
      p_phase_label: 'Fase 1 – Recolección Documental',
      p_macro_state: 'En diagnóstico',
      p_metadata: {},
    })
    setCreating(false)
    if (error) {
      setErr(error.message)
      showError(error.message)
      return
    }
    setNewName('')
    await load()
    if (data) {
      showSuccess('Proyecto creado desde la plantilla. Entrando al expediente…')
      window.setTimeout(() => navigate(`/p/${data}`, { replace: true }), 600)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {notice ? (
        <NoticeBanner notice={notice} onDismiss={clear} className="mb-6" />
      ) : null}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada proyecto tiene su expediente, checklist documental y módulos vinculados en
            Supabase.
          </p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl" onClick={() => void signOut()}>
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-accent" />
            Nuevo proyecto desde plantilla
          </CardTitle>
          <CardDescription>
            Copia la estructura legal–urbanística (34 ítems documentales + módulos base). Luego
            puede editar títulos, añadir secciones o documentos en recolección.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={createProject}>
            <div className="flex-1 space-y-2">
              <Label htmlFor="pname">Nombre del proyecto</Label>
              <Input
                id="pname"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Urbanización Los Pinos"
                required
              />
            </div>
            <Button type="submit" className="rounded-xl" disabled={creating}>
              {creating ? 'Creando…' : 'Crear'}
            </Button>
          </form>
          {creating ? (
            <div className="mt-4">
              <IndeterminateProgress label="Clonando plantilla, secciones y módulos en Supabase…" />
            </div>
          ) : null}
          {err && !notice ? <p className="mt-3 text-sm text-destructive">{err}</p> : null}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando proyectos…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay proyectos. Si acaba de registrarse, verifique que el trigger{' '}
          <code className="rounded bg-muted px-1">on_auth_user_created</code> esté activo en
          Supabase.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {rows.map((p) => (
            <li key={p.id}>
              <Link to={`/p/${p.id}`}>
                <Card className="h-full transition hover:border-accent/40 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FolderOpen className="h-4 w-4 text-accent" />
                      {p.name}
                    </CardTitle>
                    <CardDescription>{p.phase_label ?? '—'}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Actualizado: {new Date(p.updated_at).toLocaleString('es-CO')}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
