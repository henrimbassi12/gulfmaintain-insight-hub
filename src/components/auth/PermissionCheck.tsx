
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionCheckProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'technician';
  fallback?: React.ReactNode;
}

export function PermissionCheck({ children, requiredRole, fallback }: PermissionCheckProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback || null;
  }

  if (requiredRole) {
    const userRole = user.user_metadata?.role || 'technician';
    
    // Hiérarchie des rôles : admin > manager > technician
    const roleHierarchy = {
      'admin': 3,
      'manager': 2,
      'technician': 1
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 1;
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return fallback || null;
    }
  }

  return <>{children}</>;
}
