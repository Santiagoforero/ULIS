import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Ruta no encontrada</CardTitle>
          <CardDescription>La URL no corresponde a ningún módulo de ULIS.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild className="rounded-xl">
            <Link to="/projects">Ir a proyectos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
