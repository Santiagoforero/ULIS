import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from '@/components/RequireAuth'
import { AuthProvider } from '@/context/AuthContext'
import { ProjectWorkspaceProvider } from '@/context/ProjectWorkspaceContext'
import { AnalisisNormativoPage } from '@/pages/AnalisisNormativoPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DiagnosticoLegalPage } from '@/pages/DiagnosticoLegalPage'
import { DocumentCollectionPage } from '@/pages/DocumentCollectionPage'
import { LicenciamientoPage } from '@/pages/LicenciamientoPage'
import { LoginPage } from '@/pages/LoginPage'
import { MCNPage } from '@/pages/MCNPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { RadicacionPage } from '@/pages/RadicacionPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { EntregableDetailPage } from '@/pages/EntregableDetailPage'
import { EntregablesHubPage } from '@/pages/EntregablesHubPage'
import { ProposalPage } from '@/pages/ProposalPage'
import { ReportesPage } from '@/pages/ReportesPage'
import { HomePage } from '@/pages/HomePage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/p/:projectId" element={<ProjectWorkspaceProvider />}>
              <Route element={<AppShell />}>
                <Route index element={<DashboardPage />} />
                <Route path="propuesta" element={<ProposalPage />} />
                <Route path="entregables" element={<EntregablesHubPage />} />
                <Route path="entregables/:deliverableId" element={<EntregableDetailPage />} />
                <Route path="recoleccion" element={<DocumentCollectionPage />} />
                <Route path="diagnostico" element={<DiagnosticoLegalPage />} />
                <Route path="analisis-normativo" element={<AnalisisNormativoPage />} />
                <Route path="mcn" element={<MCNPage />} />
                <Route path="radicacion" element={<RadicacionPage />} />
                <Route path="licenciamiento" element={<LicenciamientoPage />} />
                <Route path="reportes" element={<ReportesPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
