
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

  // Menu principal (navigation rapide)
  const primaryMenuItems = [
    { icon: BarChart3, label: "Tableau de bord", href: "/dashboard" },
    { icon: Package, label: "Équipements", href: "/equipments" },
    { icon: Wrench, label: "Maintenance", href: "/maintenance", subItems: [
      { icon: Calendar, label: "Planning", href: "/planning" }
    ]},
    { icon: MessageCircle, label: "Messages", href: "/messages" },
  ];

  // Menu secondaire (dans "Plus") - gestion des utilisateurs retirée
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
            <h1 className="text-base md:text-lg font-semibold text-gray-900">
              GulfMaintain
            </h1>
            <p className="text-xs text-gray-500 font-normal">
              Gestion de maintenance
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {/* Menu principal */}
          {primaryMenuItems.map((item) => {
            const isActive = isPathActive(item.href) || (item.label === "Maintenance" && isMaintenanceActive);
            
            if (item.subItems) {
              return (
                <SidebarMenuItem key={item.href}>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={isActive} size="lg" className="w-full">
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className={cn(
                            "w-5 h-5 md:w-4 md:h-4",
                            isActive ? "text-blue-600" : "text-gray-500"
                          )} />
                          <span className={cn(
                            "font-medium text-sm md:text-sm flex-1 text-left group-data-[collapsible=icon]:hidden",
                            isActive ? "text-blue-600" : "text-gray-700"
                          )}>
                            {item.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 mt-1 group-data-[collapsible=icon]:hidden">
                      <div className="flex flex-col gap-1">
                        <Link 
                          to={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            isPathActive(item.href) 
                              ? "bg-blue-50 text-blue-600" 
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          Liste des tâches
                        </Link>
                        {item.subItems.map((subItem) => (
                          <Link 
                            key={subItem.href}
                            to={subItem.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                              isPathActive(subItem.href) 
                                ? "bg-blue-50 text-blue-600" 
                                : "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            <subItem.icon className="w-4 h-4" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} size="lg">
                  <Link to={item.href} className="flex items-center gap-3 w-full">
                    <item.icon className={cn(
                      "w-5 h-5 md:w-4 md:h-4",
                      isActive ? "text-blue-600" : "text-gray-500"
                    )} />
                    <span className={cn(
                      "font-medium text-sm md:text-sm group-data-[collapsible=icon]:hidden",
                      isActive ? "text-blue-600" : "text-gray-700"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {/* Menu "Plus" */}
          <SidebarMenuItem>
            <Collapsible open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full">
                  <div className="flex items-center gap-3 w-full">
                    <MoreHorizontal className="w-5 h-5 md:w-4 md:h-4 text-gray-500" />
                    <span className="font-medium text-sm md:text-sm text-gray-700 flex-1 text-left group-data-[collapsible=icon]:hidden">
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
                            ? "bg-blue-50 text-blue-600" 
                            : "text-gray-600 hover:bg-gray-50"
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
      
      <SidebarFooter className="mt-8 pt-4 border-t border-gray-200">
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
