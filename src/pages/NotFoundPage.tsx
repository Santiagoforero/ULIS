import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Ruta no configurada en ULIS</CardTitle>
          <CardDescription>
            La ruta solicitada no existe en este entorno de consultoría simulada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="rounded-xl">
            <Link to="/">Volver al dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
