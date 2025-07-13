import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/MainLayout';
import { MobileHeader } from '@/components/MobileHeader';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Equipments from '@/pages/Equipments';
import Maintenance from '@/pages/Maintenance';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Messages from '@/pages/Messages';
import GeolocationPage from '@/pages/GeolocationPage';
import Supervision from '@/pages/Supervision';
import MaintenanceCalendarPage from '@/pages/MaintenanceCalendarPage';
import EquipmentHistoryPage from '@/pages/EquipmentHistoryPage';
import PendingApproval from '@/pages/PendingApproval';
import Welcome from '@/pages/Welcome';
import NotFound from '@/pages/NotFound';
import TestPage from '@/pages/TestPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              {/* Mobile Header - visible uniquement sur mobile */}
              <MobileHeader />
              
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/equipments" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Equipments />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/maintenance" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Maintenance />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/maintenance-calendar" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MaintenanceCalendarPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/planning" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MaintenanceCalendarPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Reports />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Messages />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/geolocation" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <GeolocationPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/supervision" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Supervision />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/equipment-history" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EquipmentHistoryPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Système de notifications global */}
              <NotificationCenter />
              
              {/* Toasters pour les notifications */}
              <Toaster />
              <SonnerToaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
