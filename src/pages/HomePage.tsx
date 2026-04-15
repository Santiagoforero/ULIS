import { Button } from '@/components/ui/button'

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
 
      </div>

    
    </div>
  )
}
