
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                <Route path="/supervision" element={<Dashboard />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
