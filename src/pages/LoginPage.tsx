import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NoticeBanner } from '@/components/NoticeBanner'
import { useAuth } from '@/context/AuthContext'
import { useNotice } from '@/hooks/useNotice'
import { LogIn, MailWarning } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

function looksLikeEmailNotConfirmed(message: string) {
  const m = message.toLowerCase()
  return (
    m.includes('email not confirmed') ||
    m.includes('correo no confirmado') ||
    m.includes('not confirmed')
  )
}

export function LoginPage() {
  const { configured, session, signIn, resendSignupEmail, loading } = useAuth()
  const nav = useNavigate()
  const { notice, showSuccess, showError, showInfo, clear } = useNotice()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [resendBusy, setResendBusy] = useState(false)

  if (!configured) return <Navigate to="/setup" replace />
  if (!loading && session) return <Navigate to="/projects" replace />

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    clear()
    setShowResend(false)
    setBusy(true)
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) {
      const msg = error.message
      if (looksLikeEmailNotConfirmed(msg)) {
        setShowResend(true)
        showInfo(
          'Debe confirmar el correo antes de entrar. Use el enlace del mensaje o reenvíe el correo desde aquí.',
        )
      } else {
        showError(msg)
      }
      return
    }
    nav('/projects', { replace: true })
  }

  async function onResend() {
    const em = email.trim()
    if (!em) {
      showError('Escriba su correo arriba para poder reenviar la confirmación.')
      return
    }
    setResendBusy(true)
    clear()
    const { error } = await resendSignupEmail(em)
    setResendBusy(false)
    if (error) {
      showError(error.message)
      return
    }
    showSuccess('Correo de confirmación reenviado. Revise su bandeja y el spam.')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      {notice ? (
        <NoticeBanner notice={notice} onDismiss={clear} className="mb-6" />
      ) : null}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
              <LogIn className="h-5 w-5 text-accent" aria-hidden />
            </div>
            <div>
              <CardTitle>Ingresar a ULIS</CardTitle>
              <CardDescription className="mt-2">
                Use su correo y contraseña registrados.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {showResend ? (
              <div className="flex flex-col gap-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm">
                <div className="flex gap-2 text-amber-950">
                  <MailWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <p className="leading-relaxed">
                    Su cuenta existe pero el correo aún no está confirmado. Revise la bandeja o
                    solicite un nuevo enlace.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full rounded-xl"
                  disabled={resendBusy}
                  onClick={() => void onResend()}
                >
                  {resendBusy ? 'Enviando…' : 'Reenviar correo de confirmación'}
                </Button>
              </div>
            ) : null}

            <Button type="submit" className="w-full rounded-xl" disabled={busy || loading}>
              {busy ? 'Ingresando…' : 'Ingresar'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Sin cuenta?{' '}
              <Link className="font-medium text-accent underline-offset-4 hover:underline" to="/register">
                Registrarse
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
