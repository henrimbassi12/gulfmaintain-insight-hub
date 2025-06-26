
import React, { createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from './auth/types';
import { useAuthState } from './auth/authStateManager';
import { createAuthService } from './auth/authService';
import { fetchUserProfile } from './auth/userProfileService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { user, session, userProfile, loading, setUserProfile } = useAuthState();
  const { signIn, signUp, signInWithOAuth, signOut, resetPassword, updatePassword } = createAuthService(toast);

  const refreshProfile = async () => {
    if (user) {
      try {
        const profile = await fetchUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du profil:', error);
        throw error;
      }
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
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
