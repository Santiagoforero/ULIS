import { useAuth } from '@/context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export function RequireAuth() {
  const { configured, session, loading } = useAuth()

  if (!configured) return <Navigate to="/" replace />
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Cargando sesión…
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}
