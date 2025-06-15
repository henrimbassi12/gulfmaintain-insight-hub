
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export function UserProfile() {
  const { user, userProfile, signOut } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    if (!name) return user.email?.substring(0, 2).toUpperCase() || 'U';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'technician':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Gestionnaire';
      case 'technician':
        return 'Technicien';
      default:
        return role;
    }
  };

  // Utiliser les vraies données du profil utilisateur
  const userRole = userProfile?.role || 'technician';
  const displayName = userProfile?.full_name || user.user_metadata?.full_name || 'Utilisateur';
  const userEmail = userProfile?.email || user.email || '';
  const userAgency = userProfile?.agency || 'Non assigné';

  return (
    <div className="border-t p-4 mt-auto">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={userProfile?.avatar_url || ""} />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {userEmail}
          </p>
          {userAgency && userAgency !== 'Non assigné' && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {userAgency}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className={`gap-1 ${getRoleBadgeColor(userRole)}`}>
          {getRoleIcon(userRole)}
          {getRoleLabel(userRole)}
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
