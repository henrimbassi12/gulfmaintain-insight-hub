
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'admin' | 'manager' | 'technician';

interface PermissionCheckProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

export function PermissionCheck({ children, allowedRoles, fallback }: PermissionCheckProps) {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return null; // On n'affiche rien pendant le chargement du profil
  }

  const userRole = userProfile?.role as Role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback || null;
  }

  return <>{children}</>;
}
