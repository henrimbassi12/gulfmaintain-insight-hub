
import React from 'react';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Settings, 
  Wrench, 
  Calendar, 
  MessageSquare, 
  FileText, 
  BarChart3 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Équipements",
    url: "/equipments",
    icon: Wrench,
  },
  {
    title: "Maintenance",
    url: "/maintenance",
    icon: Calendar,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    badge: 3
  },
  {
    title: "Supervision IA",
    url: "/supervision",
    icon: BarChart3,
  },
  {
    title: "Rapports",
    url: "/reports",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <ShadcnSidebar className="border-r bg-slate-50/50">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GM</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900">GulfMaintain</h2>
            <p className="text-xs text-slate-500">Gestion intelligente</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-500 px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full"
                  >
                    <Link 
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-blue-100 text-blue-700">TM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Tech Manager</p>
            <p className="text-xs text-slate-500 truncate">manager@gulfmaintain.com</p>
          </div>
          <Link to="/settings">
            <Settings className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
