
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Equipments from "./pages/Equipments";
import Maintenance from "./pages/Maintenance";
import Messages from "./pages/Messages";
import Supervision from "./pages/Supervision";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider delayDuration={300}>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
              <div className="p-2">
                <SidebarTrigger />
              </div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/equipments" element={<Equipments />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/supervision" element={<Supervision />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
