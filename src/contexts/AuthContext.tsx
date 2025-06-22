
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
  const fetchUserProfile = async (userId: string): Promise<any> => {
    try {
      console.log('🔍 fetchUserProfile - Récupération pour userId:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('❌ fetchUserProfile - Erreur:', error);
        return null;
      }
      
      console.log('✅ fetchUserProfile - Profil récupéré:', data);
      return data;
    } catch (error) {
      console.error('❌ fetchUserProfile - Erreur catch:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider - Initialisation');
    
    let isMounted = true;
    
    // Timeout de sécurité simplifié
    const globalTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log('⏰ AuthProvider - Timeout global, arrêt du loading');
        setLoading(false);
      }
    }, 10000);

    // Gestionnaire d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 AuthProvider - Auth state change:', event, session?.user?.email);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('👤 AuthProvider - Utilisateur connecté, récupération du profil...');
            
            // Attendre un peu pour que la base de données soit à jour
            setTimeout(async () => {
              if (isMounted) {
                const profile = await fetchUserProfile(session.user.id);
                if (isMounted) {
                  setUserProfile(profile);
                  setLoading(false);
                  clearTimeout(globalTimeout);
                }
              }
            }, 500);
          } else {
            console.log('❌ AuthProvider - Déconnexion, effacement du profil');
            setUserProfile(null);
            setLoading(false);
            clearTimeout(globalTimeout);
          }
        } catch (error) {
          console.error('❌ AuthProvider - Erreur dans auth state change:', error);
          if (isMounted) {
            setLoading(false);
            clearTimeout(globalTimeout);
          }
        }
      }
    );

    // Vérification de session existante
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log('🔍 AuthProvider - Session existante:', session?.user?.email);
      
      try {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (isMounted) {
            setUserProfile(profile);
          }
        }
        
        if (isMounted) {
          setLoading(false);
          clearTimeout(globalTimeout);
        }
      } catch (error) {
        console.error('❌ AuthProvider - Erreur session existante:', error);
        if (isMounted) {
          setLoading(false);
          clearTimeout(globalTimeout);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(globalTimeout);
      subscription.unsubscribe();
    };
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
          description: "Email ou mot de passe incorrect",
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
      console.error('❌ Erreur catch signIn:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, role?: string) => {
    try {
      console.log('📝 Tentative d\'inscription pour:', email, { fullName, role });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
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
        console.error('❌ Erreur d\'inscription:', error);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Inscription réussie:', data);
        
        // Si l'utilisateur est créé immédiatement (pas de confirmation email)
        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Inscription réussie",
            description: "Vérifiez votre email pour confirmer votre compte",
          });
        } else if (data.user) {
          toast({
            title: "Inscription réussie",
            description: "Votre compte a été créé avec succès",
          });
        }
      }

      return { error };
    } catch (error: any) {
      console.error('❌ Erreur catch signUp:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
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
