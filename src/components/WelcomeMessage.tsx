
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

export function WelcomeMessage() {
  const { user } = useAuth();

  if (!user) return null;

  const getUserName = () => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur';
  };

  const getUserRole = () => {
    const role = user.user_metadata?.role || 'technician';
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Manager';
      case 'technician':
        return 'Technicien';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleIcon = () => {
    const role = user.user_metadata?.role || 'technician';
    return role === 'admin' || role === 'manager' ? Shield : User;
  };

  const RoleIcon = getRoleIcon();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <RoleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Bienvenue {getUserName()}
            </h3>
            <p className="text-sm text-gray-600">
              {getUserRole()} - GulfMaintain
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
