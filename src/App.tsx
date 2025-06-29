
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "@/pages/Index";
import Welcome from "@/pages/Welcome";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
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

// Composant wrapper pour les routes avec sidebar
const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </SidebarProvider>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Index />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/equipments" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Equipments />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Maintenance />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/planning" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <MaintenanceCalendarPage />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Reports />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Settings />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Messages />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/supervision" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Supervision />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/geolocation" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <GeolocationPage />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              <Route path="/equipment-history" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <EquipmentHistoryPage />
                  </LayoutWithSidebar>
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
