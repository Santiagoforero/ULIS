import { AppShell } from '@/components/layout/AppShell'
import { UlisProvider } from '@/context/UlisContext'
import { AnalisisNormativoPage } from '@/pages/AnalisisNormativoPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DiagnosticoLegalPage } from '@/pages/DiagnosticoLegalPage'
import { DocumentCollectionPage } from '@/pages/DocumentCollectionPage'
import { LicenciamientoPage } from '@/pages/LicenciamientoPage'
import { MCNPage } from '@/pages/MCNPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RadicacionPage } from '@/pages/RadicacionPage'
import { ReportesPage } from '@/pages/ReportesPage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <UlisProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="recoleccion" element={<DocumentCollectionPage />} />
            <Route path="diagnostico" element={<DiagnosticoLegalPage />} />
            <Route path="analisis-normativo" element={<AnalisisNormativoPage />} />
            <Route path="mcn" element={<MCNPage />} />
            <Route path="radicacion" element={<RadicacionPage />} />
            <Route path="licenciamiento" element={<LicenciamientoPage />} />
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UlisProvider>
  )
}
