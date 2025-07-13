import React from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobile } = useSidebar();
  const location = useLocation();

  // Fonction pour obtenir le titre de la page en fonction de la route
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Tableau de bord';
      case '/equipments':
        return 'Équipements';
      case '/maintenance':
        return 'Maintenances';
      case '/planning':
        return 'Planning';
      case '/messages':
        return 'Messages';
      case '/reports':
        return 'Rapports';
      case '/settings':
        return 'Paramètres';
      case '/geolocation':
        return 'Géolocalisation';
      case '/supervision':
        return 'Supervision';
      case '/equipment-history':
        return 'Historique';
      default:
        return 'GulfMaintain';
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Sidebar desktop uniquement */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Header desktop avec sidebar trigger */}
        <header className="hidden md:flex h-14 items-center border-b bg-white px-4 sticky top-0 z-50 shadow-sm">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle(location.pathname)}
          </h1>
        </header>

        {/* Contenu principal - padding uniquement sur mobile */}
        <main className="flex-1 overflow-auto md:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}