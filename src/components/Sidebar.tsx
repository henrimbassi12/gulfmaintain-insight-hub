
import React from "react";
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
  Menu,
  Users
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const { user, userProfile } = useAuth();

  console.log('🔍 Sidebar Debug - État complet:', {
    user: user ? {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    } : null,
    userProfile: userProfile ? {
      id: userProfile.id,
      role: userProfile.role,
      account_status: userProfile.account_status,
      full_name: userProfile.full_name
    } : null,
    userRole: userProfile?.role,
    accountStatus: userProfile?.account_status,
    isAdmin: userProfile?.role === 'admin',
    isApproved: userProfile?.account_status === 'approved',
    shouldShowUserManagement: userProfile?.role === 'admin' && userProfile?.account_status === 'approved'
  });

  // Menu items de base
  const baseMenuItems = [
    { icon: Home, label: "Tableau de bord", href: "/dashboard" },
    { icon: Wrench, label: "Équipements", href: "/equipments" },
    { icon: Settings, label: "Maintenance", href: "/maintenance" },
    { icon: Calendar, label: "Planning", href: "/planning" },
    { icon: MapPin, label: "Géolocalisation", href: "/geolocation" },
    { icon: Clock, label: "Historique", href: "/equipment-history" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: Eye, label: "Supervision", href: "/supervision" },
    { icon: FileText, label: "Rapports", href: "/reports" },
    { icon: BarChart3, label: "Paramètres", href: "/settings" },
  ];

  // Ajouter la gestion des utilisateurs pour les admins
  const isAdmin = userProfile?.role === 'admin' && userProfile?.account_status === 'approved';
  console.log('🛡️ Is Admin Check Final:', {
    userProfile: !!userProfile,
    role: userProfile?.role,
    accountStatus: userProfile?.account_status,
    isAdmin
  });
  
  const menuItems = isAdmin 
    ? [...baseMenuItems, { icon: Users, label: "Gestion des utilisateurs", href: "/user-management" }]
    : baseMenuItems;

  console.log('📋 Menu Items Final:', menuItems.map(item => ({ label: item.label, href: item.href })));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Mobile Header avec trigger de sidebar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-3 flex items-center justify-between">
          <SidebarTrigger className="p-2">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-900">
              Gulf Maintain
            </h1>
          </div>
          
          <div className="flex items-center gap-1">
            <NotificationSystem />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          <div>
            <h1 className="text-base md:text-lg font-semibold text-gray-900">
              Gulf Maintain
            </h1>
            <p className="text-xs text-gray-500 font-normal">
              Gestion de maintenance
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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
                      "font-medium text-sm md:text-sm",
                      isActive ? "text-blue-600" : "text-gray-700"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
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
