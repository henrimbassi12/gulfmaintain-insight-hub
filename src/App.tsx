
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Equipments from "@/pages/Equipments";
import Maintenance from "@/pages/Maintenance";
import MaintenanceCalendarPage from "@/pages/MaintenanceCalendarPage";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Messages from "@/pages/Messages";
import Supervision from "@/pages/Supervision";
import GeolocationPage from "@/pages/GeolocationPage";
import EquipmentHistoryPage from "@/pages/EquipmentHistoryPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/Sidebar";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Index />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/equipments" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Equipments />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Maintenance />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/planning" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <MaintenanceCalendarPage />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Reports />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Settings />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Messages />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/supervision" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <Supervision />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/geolocation" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <GeolocationPage />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/equipment-history" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto">
                      <EquipmentHistoryPage />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
