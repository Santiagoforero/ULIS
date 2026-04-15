import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle2, Mail, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

type Phase = 'form' | 'check_email'

export function RegisterPage() {
  const { configured, session, signUp, resendSignupEmail, loading } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState<Phase>('form')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resendInfo, setResendInfo] = useState<string | null>(null)
  const [resendBusy, setResendBusy] = useState(false)

  if (!configured) return <Navigate to="/setup" replace />
  if (!loading && session) return <Navigate to="/projects" replace />

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setResendInfo(null)
    setBusy(true)
    const { error, needsEmailConfirmation } = await signUp(email, password, fullName)
    setBusy(false)
    if (error) {
      setErr(error.message)
      return
    }
    setRegisteredEmail(email.trim())
    if (needsEmailConfirmation) {
      setPhase('check_email')
      return
    }
    /* Sesión inmediata: onAuthStateChange redirige a /projects */
  }

  async function onResend() {
    setResendInfo(null)
    setErr(null)
    setResendBusy(true)
    const { error } = await resendSignupEmail(registeredEmail)
    setResendBusy(false)
    if (error) {
      setErr(error.message)
      return
    }
    setResendInfo('Le hemos vuelto a enviar el correo. Revise también la carpeta de spam.')
  }

  if (phase === 'check_email') {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <Card className="border-accent/25 shadow-card">
          <CardHeader className="space-y-4 text-center sm:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 sm:mx-0">
              <Mail className="h-7 w-7 text-accent" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-2xl">Confirme su correo</CardTitle>
              <CardDescription className="mt-2 text-base leading-relaxed">
                Su cuenta en ULIS está creada. Para activarla debe abrir el enlace que le enviamos
                a su bandeja de entrada.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Correo registrado
              </p>
              <p className="mt-1 break-all font-mono text-sm font-medium text-foreground">
                {registeredEmail}
              </p>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                Abra el mensaje de confirmación (asunto suele mencionar «Confirm» o «confirmar»).
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                Pulse el botón o enlace del correo; será redirigido al inicio de sesión.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                Si su proyecto Supabase exige confirmación, no podrá entrar hasta completar este paso.
              </li>
            </ul>

            {err ? <p className="text-sm text-destructive">{err}</p> : null}
            {resendInfo ? (
              <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-foreground">
                {resendInfo}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                disabled={resendBusy}
                onClick={() => void onResend()}
              >
                {resendBusy ? 'Enviando…' : 'Reenviar correo de confirmación'}
              </Button>
              <Button type="button" variant="outline" className="rounded-xl" asChild>
                <Link to="/login">Ir al inicio de sesión</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-muted-foreground"
                onClick={() => {
                  setPhase('form')
                  setErr(null)
                  setResendInfo(null)
                }}
              >
                Volver al formulario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden />
            </div>
            <div>
              <CardTitle>Crear cuenta ULIS</CardTitle>
       
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="fn">Nombre completo</Label>
              <Input
                id="fn"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {err ? <p className="text-sm text-destructive">{err}</p> : null}
            <Button type="submit" className="w-full rounded-xl" disabled={busy || loading}>
              {busy ? 'Creando cuenta…' : 'Registrarse'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tiene cuenta?{' '}
              <Link className="font-medium text-accent underline-offset-4 hover:underline" to="/login">
                Ingresar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
