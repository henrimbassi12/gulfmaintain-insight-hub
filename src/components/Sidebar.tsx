
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
  SidebarMenuItem 
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
  Clock
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
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
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
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors touch-action-manipulation">
                    <item.icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-blue-600" : "text-gray-500"
                    )} />
                    <span className={cn(
                      "font-medium",
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
          <h3 className="text-sm font-medium text-gray-500 mb-3">Actions rapides</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <NotificationSystem />
              <DataExport />
            </div>
            <div className="mobile-hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
