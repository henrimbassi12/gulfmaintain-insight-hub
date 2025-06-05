
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'technician':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'manager':
        return <User className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="border-t p-4 mt-auto">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {getInitials(user.email || '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.user_metadata?.full_name || 'Utilisateur'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className={`gap-1 ${getRoleBadgeColor(user.user_metadata?.role || 'technician')}`}>
          {getRoleIcon(user.user_metadata?.role || 'technician')}
          {user.user_metadata?.role || 'technician'}
        </Badge>
        <OfflineIndicator />
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={signOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  );
}
