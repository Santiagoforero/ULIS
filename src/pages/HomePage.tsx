import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { Link, Navigate } from 'react-router-dom'

export function HomePage() {
  const { configured, session, loading } = useAuth()

  if (!loading && configured && session) {
    return <Navigate to="/projects" replace />
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          ULIS
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Urban Legal Intelligence System
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Gestión de expedientes legales y urbanísticos con Supabase.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button className="rounded-xl" asChild>
            <Link to="/login">Ingresar</Link>
          </Button>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link to="/register">Crear cuenta</Link>
          </Button>
        </div>
        {!configured ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Configure Supabase abajo antes de poder usar el registro y el inicio de sesión.
          </p>
        ) : null}
      </div>

      {!configured ? (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Supabase</CardTitle>
            <CardDescription>
              Cree un archivo <code className="rounded bg-muted px-1">.env</code> en la raíz del
              proyecto copiando <code className="rounded bg-muted px-1">.env.example</code> y
              complete <code className="rounded bg-muted px-1">VITE_SUPABASE_URL</code> y{' '}
              <code className="rounded bg-muted px-1">VITE_SUPABASE_ANON_KEY</code> desde el panel
              de Supabase (Settings → API).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Luego ejecute el SQL del archivo{' '}
              <code className="rounded bg-muted px-1">supabase/schema.sql</code> en el SQL Editor
              del proyecto Supabase.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-accent/25 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">Listo para usar</CardTitle>
            <CardDescription>
              Supabase está configurado. Entre con su cuenta o cree una nueva.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
