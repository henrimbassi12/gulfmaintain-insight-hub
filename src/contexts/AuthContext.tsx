
import React, { createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from './auth/types';
import { useAuthState } from './auth/authStateManager';
import { createAuthService } from './auth/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { user, session, userProfile, loading } = useAuthState();
  const { signIn, signUp, signInWithOAuth, signOut } = createAuthService(toast);

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
