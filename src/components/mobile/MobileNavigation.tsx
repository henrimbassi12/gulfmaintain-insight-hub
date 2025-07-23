import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Wrench, 
  ClipboardList, 
  MapPin,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNativeCapabilities } from '@/hooks/useNativeCapabilities';

interface NavigationItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { path: '/dashboard', icon: Home, label: 'Tableau de bord' },
  { path: '/equipments', icon: Settings, label: 'Équipements' },
  { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { path: '/reports', icon: ClipboardList, label: 'Rapports' },
  { path: '/geolocation', icon: MapPin, label: 'Géolocalisation' },
  { path: '/supervision', icon: BarChart3, label: 'Supervision' },
  { path: '/planning', icon: Calendar, label: 'Planning' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
];

export function MobileNavigation() {
  const { isMobile } = useNativeCapabilities();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-1">
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative
                ${isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
                transition-colors duration-200
              `}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 truncate w-full text-center">
                {item.label.split(' ')[0]}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}