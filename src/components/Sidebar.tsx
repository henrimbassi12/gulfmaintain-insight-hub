
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlobalSearch } from "@/components/GlobalSearch";
import { DataExport } from "@/components/DataExport";
import { NotificationSystem } from "@/components/NotificationSystem";
import {
  Home,
  Wrench,
  MessageSquare,
  BarChart3,
  Settings,
  Eye,
  FileText,
  Shield,
  Calendar,
  MapPin,
  Clock,
  Menu
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Tableau de bord", href: "/" },
  { icon: Wrench, label: "Équipements", href: "/equipments" },
  { icon: Settings, label: "Maintenance", href: "/maintenance" },
  { icon: Calendar, label: "Planning", href: "/calendar" },
  { icon: MapPin, label: "Géolocalisation", href: "/geolocation" },
  { icon: Clock, label: "Historique", href: "/history" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Eye, label: "Supervision", href: "/supervision" },
  { icon: FileText, label: "Rapports", href: "/reports" },
  { icon: BarChart3, label: "Paramètres", href: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <>
      {/* Mobile Header avec trigger de sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-3 flex items-center justify-between">
        <SidebarTrigger className="p-2">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Gulf Maintain
          </h1>
        </div>
        
        <div className="flex items-center gap-1">
          <NotificationSystem />
          <ThemeToggle />
        </div>
      </div>

      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            <div>
              <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                Gulf Maintain
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Gestion de maintenance
              </p>
            </div>
          </div>
          
          {/* Recherche globale - masquée sur mobile */}
          <div className="mt-4 mobile-hidden">
            <GlobalSearch />
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-2 md:p-4">
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} size="lg">
                    <Link to={item.href} className="flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors touch-action-manipulation tap-highlight-transparent">
                      <item.icon className={cn(
                        "w-5 h-5 md:w-4 md:h-4",
                        isActive ? "text-blue-600" : "text-gray-500"
                      )} />
                      <span className={cn(
                        "font-medium text-sm md:text-base",
                        isActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                      )}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          {/* Actions rapides */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">Actions rapides</h3>
            <div className="space-y-2">
              <div className="flex gap-2 px-2">
                <div className="md:hidden flex-1">
                  <NotificationSystem />
                </div>
                <DataExport />
              </div>
              <div className="mobile-hidden px-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </SidebarContent>

        <SidebarFooter className="p-2 md:p-4">
          <UserProfile />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
