
import React, { useState } from "react";
import { cn } from "@/lib/utils";
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
import { GlobalSearch } from "@/components/GlobalSearch";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Package,
  Wrench,
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  Bot,
  FileText,
  Settings,
  Menu,
  Shield,
  MoreHorizontal,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AppSidebar() {
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMaintenanceMenuOpen, setIsMaintenanceMenuOpen] = useState(true);

  // Menu principal (navigation rapide)
  const primaryMenuItems = [
    { icon: BarChart3, label: "Tableau de bord", href: "/dashboard" },
    { icon: Package, label: "Équipements", href: "/equipments" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
  ];

  // Menu secondaire (dans "Plus")
  const secondaryMenuItems = [
    { icon: Clock, label: "Historique", href: "/equipment-history" },
    { icon: FileText, label: "Rapports", href: "/reports" },
    { icon: MapPin, label: "Géolocalisation", href: "/geolocation" },
    { icon: Settings, label: "Paramètres", href: "/settings" },
  ];

  const isPathActive = (href: string) => location.pathname === href;
  const isMaintenanceActive = location.pathname === '/maintenance' || location.pathname === '/planning';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
              GulfMaintain
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              Gestion de maintenance
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {/* Menu principal */}
          {primaryMenuItems.map((item) => {
            const isActive = isPathActive(item.href);
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} size="lg">
                  <Link to={item.href} className="flex items-center gap-3 w-full">
                    <item.icon className={cn(
                      "w-5 h-5 md:w-4 md:h-4",
                      isActive ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
                    )} />
                    <span className={cn(
                      "font-medium text-sm md:text-sm group-data-[collapsible=icon]:hidden",
                      isActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {/* Section Gestion des maintenances */}
          <SidebarMenuItem>
            <Collapsible open={isMaintenanceMenuOpen} onOpenChange={setIsMaintenanceMenuOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isMaintenanceActive} size="lg" className="w-full">
                  <div className="flex items-center gap-3 w-full">
                    <Wrench className={cn(
                      "w-5 h-5 md:w-4 md:h-4",
                      isMaintenanceActive ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
                    )} />
                    <span className={cn(
                      "font-medium text-sm md:text-sm flex-1 text-left group-data-[collapsible=icon]:hidden",
                      isMaintenanceActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                    )}>
                      Gestion des maintenances
                    </span>
                    <div className="group-data-[collapsible=icon]:hidden">
                      {isMaintenanceMenuOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-6 mt-1 group-data-[collapsible=icon]:hidden">
                <div className="flex flex-col gap-1">
                  <Link 
                    to="/maintenance"
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                      isPathActive("/maintenance") 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <Wrench className="w-4 h-4" />
                    Tâches de maintenance
                  </Link>
                  <Link 
                    to="/planning"
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                      isPathActive("/planning") 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <Calendar className="w-4 h-4" />
                    Vue planning
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Menu "Plus" */}
          <SidebarMenuItem>
            <Collapsible open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full">
                  <div className="flex items-center gap-3 w-full">
                    <MoreHorizontal className="w-5 h-5 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-sm md:text-sm text-gray-700 dark:text-gray-300 flex-1 text-left group-data-[collapsible=icon]:hidden">
                      Plus
                    </span>
                    <div className="group-data-[collapsible=icon]:hidden">
                      {isMoreMenuOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-6 mt-1 group-data-[collapsible=icon]:hidden">
                <div className="flex flex-col gap-1">
                  {secondaryMenuItems.map((item) => {
                    const isActive = isPathActive(item.href);
                    return (
                      <Link 
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive 
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-1">
              <UserProfile />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
