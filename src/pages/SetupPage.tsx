import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SetupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Configurar Supabase</CardTitle>
          <CardDescription>
            Cree un archivo <code className="rounded bg-muted px-1">.env</code> en la raíz del
            proyecto copiando <code className="rounded bg-muted px-1">.env.example</code> y
            complete <code className="rounded bg-muted px-1">VITE_SUPABASE_URL</code> y{' '}
            <code className="rounded bg-muted px-1">VITE_SUPABASE_ANON_KEY</code> desde el
            panel de Supabase (Settings → API).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Luego ejecute el SQL del archivo <code className="rounded bg-muted px-1">supabase/schema.sql</code> en el
            SQL Editor del proyecto Supabase.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
