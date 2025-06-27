
import React from 'react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Shield, 
  BarChart3, 
  Package, 
  Wrench, 
  Calendar, 
  MessageCircle, 
  Clock, 
  FileText, 
  MapPin, 
  Bot, 
  Settings, 
  Users 
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: BarChart3, label: "Tableau de bord", href: "/dashboard" },
  { icon: Package, label: "Équipements", href: "/equipments" },
  { icon: Wrench, label: "Maintenance", href: "/maintenance" },
  { icon: Calendar, label: "Planning", href: "/planning" },
  { icon: MessageCircle, label: "Messages", href: "/messages" },
  { icon: Clock, label: "Historique", href: "/equipment-history" },
  { icon: FileText, label: "Rapports", href: "/reports" },
  { icon: MapPin, label: "Géolocalisation", href: "/geolocation" },
  // { icon: Bot, label: "Supervision", href: "/supervision" }, // MASQUÉ - Fonctionnalité intégrée au Dashboard
  { icon: Settings, label: "Paramètres", href: "/settings" },
];

export function MobileDrawer() {
  const location = useLocation();
  const { userProfile } = useAuth();
  const [open, setOpen] = React.useState(false);

  // Ajouter la gestion des utilisateurs pour les admins
  const isAdmin = userProfile?.role === 'admin' && userProfile?.account_status === 'approved';
  const allMenuItems = isAdmin 
    ? [...menuItems, { icon: Users, label: "Gestion des utilisateurs", href: "/user-management" }]
    : menuItems;

  const isPathActive = (href: string) => location.pathname === href;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">GulfMaintain</h2>
              <p className="text-sm text-gray-500">Gestion de maintenance</p>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {allMenuItems.map((item) => {
              const isActive = isPathActive(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full",
                    isActive 
                      ? "bg-blue-50 text-blue-600 border border-blue-200" 
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <IconComponent className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
