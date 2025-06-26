
import React from 'react';
import { Shield, Bell } from 'lucide-react';
import { MobileDrawer } from './ui/mobile-drawer';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function MobileHeader() {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "Vous avez 2 nouvelles notifications",
    });
  };

  return (
    <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <MobileDrawer />
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">GulfMaintain</h1>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleNotificationClick}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </Button>
        
        {userProfile && (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {userProfile.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
