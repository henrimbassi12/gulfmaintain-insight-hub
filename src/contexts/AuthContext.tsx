import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: any;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string, role?: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'facebook' | 'linkedin_oidc') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Recherche du profil pour userId:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('❌ Erreur lors de la récupération du profil:', error);
        console.error('❌ Code d\'erreur:', error.code);
        console.error('❌ Message:', error.message);
        
        // Si le profil n'existe pas, on va le créer
        if (error.code === 'PGRST116') {
          console.log('⚠️ Profil inexistant, tentative de création...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: session?.user?.email || '',
              full_name: session?.user?.user_metadata?.full_name || '',
              role: session?.user?.user_metadata?.role || 'admin',  // Forcer admin pour debug
              account_status: 'approved'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('❌ Erreur création profil:', createError);
            return null;
          }
          
          console.log('✅ Profil créé:', newProfile);
          return newProfile;
        }
        
        return null;
      }
      
      console.log('✅ Profil récupéré:', data);
      console.log('📊 Statut du compte:', data.account_status);
      console.log('🏷️ Rôle utilisateur:', data.role);
      return data;
    } catch (error) {
      console.error('❌ Erreur catch dans fetchUserProfile:', error);
      if (error instanceof Error) {
        console.error('❌ Message d\'erreur:', error.message);
        console.error('❌ Stack trace:', error.stack);
      }
      return null;
    }
  };

  useEffect(() => {
    console.log('🚀 Initialisation AuthProvider');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 Utilisateur connecté, récupération du profil...');
          console.log('🆔 User ID:', session.user.id);
          console.log('📧 Email:', session.user.email);
          console.log('🏷️ Metadata:', session.user.user_metadata);
          
          try {
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
            console.log('📋 Profil défini:', profile);
          } catch (error) {
            console.error('❌ Erreur lors de la récupération du profil:', error);
            setUserProfile(null);
          }
        } else {
          console.log('❌ Aucun utilisateur, profil effacé');
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🔍 Session existante trouvée:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Session existante, récupération du profil...');
        console.log('🆔 User ID existant:', session.user.id);
        try {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          console.log('📋 Profil défini pour session existante:', profile);
        } catch (error) {
          console.error('❌ Erreur lors de la récupération du profil pour session existante:', error);
          setUserProfile(null);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentative de connexion pour:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Erreur de connexion:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Connexion réussie');
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('❌ Erreur catch:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, role?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || '',
            role: role || 'technician'
          }
        }
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'linkedin_oidc') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
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
