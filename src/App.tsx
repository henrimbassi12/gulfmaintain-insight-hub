
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { NotificationCenter } from '@/components/NotificationCenter';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/equipments" element={
                  <ProtectedRoute>
                    <Equipments />
                  </ProtectedRoute>
                } />
                <Route path="/maintenance" element={
                  <ProtectedRoute>
                    <Maintenance />
                  </ProtectedRoute>
                } />
                <Route path="/maintenance-calendar" element={
                  <ProtectedRoute>
                    <MaintenanceCalendarPage />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/geolocation" element={
                  <ProtectedRoute>
                    <GeolocationPage />
                  </ProtectedRoute>
                } />
                <Route path="/supervision" element={
                  <ProtectedRoute>
                    <Supervision />
                  </ProtectedRoute>
                } />
                <Route path="/equipment-history" element={
                  <ProtectedRoute>
                    <EquipmentHistoryPage />
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
