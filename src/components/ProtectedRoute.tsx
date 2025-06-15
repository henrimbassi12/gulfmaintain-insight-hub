
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PendingApproval from '@/pages/PendingApproval';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - État:', {
    loading,
    user: user?.email,
    userProfile,
    accountStatus: userProfile?.account_status
  });

  if (loading) {
    console.log('⏳ Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ Pas d\'utilisateur, redirection vers /');
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté mais son compte n'est pas approuvé
  if (userProfile && userProfile.account_status === 'pending') {
    console.log('⏸️ Compte en attente d\'approbation');
    return <PendingApproval />;
  }

  // Si le compte est rejeté, rediriger vers l'accueil
  if (userProfile && userProfile.account_status === 'rejected') {
    console.log('❌ Compte rejeté, redirection vers /');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Accès autorisé au contenu protégé');
  return <>{children}</>;
}
