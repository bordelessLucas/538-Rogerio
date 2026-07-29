import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { MapPage } from '@/features/map/pages/MapPage'
import { MonitoringPage } from '@/features/monitoring/pages/MonitoringPage'
import { ClientsPage } from '@/features/network/pages/ClientsPage'
import { ClientDetailPage } from '@/features/network/pages/ClientDetailPage'
import { CtosPage } from '@/features/network/pages/CtosPage'
import { CtoDetailPage } from '@/features/network/pages/CtoDetailPage'
import { NetworkLayout } from '@/features/network/pages/NetworkLayout'
import { NetworkOverviewPage } from '@/features/network/pages/NetworkOverviewPage'
import { OltsPage } from '@/features/network/pages/OltsPage'
import { PonsPage } from '@/features/network/pages/PonsPage'
import { PlaceholderPage } from '@/shared/ui/PlaceholderPage'
import { ToastProvider } from '@/shared/ui/Toast'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="mapa" element={<MapPage />} />
                <Route path="rede" element={<NetworkLayout />}>
                  <Route index element={<NetworkOverviewPage />} />
                  <Route path="olts" element={<OltsPage />} />
                  <Route path="pons" element={<PonsPage />} />
                  <Route path="ctos" element={<CtosPage />} />
                  <Route path="ctos/:id" element={<CtoDetailPage />} />
                  <Route path="clientes" element={<ClientsPage />} />
                  <Route path="clientes/:id" element={<ClientDetailPage />} />
                </Route>
                <Route path="monitoramento" element={<MonitoringPage />} />
                <Route
                  path="chamados"
                  element={
                    <PlaceholderPage
                      title="Chamados"
                      description="Placeholder do menu. CRUD entra nas próximas fases."
                    />
                  }
                />
                <Route
                  path="configuracoes"
                  element={
                    <PlaceholderPage
                      title="Configurações"
                      description="Preferências da operadora e limiares na Sprint 02."
                    />
                  }
                />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
