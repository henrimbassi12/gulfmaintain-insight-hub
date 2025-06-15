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

  // Fonction pour récupérer le profil utilisateur avec timeout
  const fetchUserProfile = async (userId: string): Promise<any> => {
    try {
      console.log('🔍 fetchUserProfile - DÉBUT pour userId:', userId);
      
      // Timeout de 5 secondes pour éviter les blocages
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ fetchUserProfile - Erreur:', error);
        
        // Si le profil n'existe pas, on va le créer
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
          console.log('⚠️ fetchUserProfile - Profil inexistant, création automatique...');
          
          const newProfileData = {
            id: userId,
            email: session?.user?.email || '',
            full_name: session?.user?.user_metadata?.full_name || '',
            role: session?.user?.user_metadata?.role || 'technician',
            account_status: 'pending' as 'pending'
          };
          
          console.log('📝 fetchUserProfile - Données du nouveau profil:', newProfileData);
          
          try {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfileData)
              .select()
              .single();
              
            if (createError) {
              console.error('❌ fetchUserProfile - Erreur création profil:', createError);
              return null;
            }
            
            console.log('✅ fetchUserProfile - Profil créé avec succès:', newProfile);
            return newProfile;
          } catch (createErr) {
            console.error('❌ fetchUserProfile - Erreur catch création:', createErr);
            return null;
          }
        }
        
        return null;
      }
      
      console.log('✅ fetchUserProfile - Profil récupéré avec succès:', data);
      return data;
    } catch (error) {
      console.error('❌ fetchUserProfile - Erreur catch:', error);
      return null;
    } finally {
      console.log('🔍 fetchUserProfile - FIN pour userId:', userId);
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider - Initialisation');
    
    let isMounted = true;
    
    // Timeout général de sécurité pour éviter les blocages
    const globalTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('⏰ AuthProvider - Timeout global, forçage de setLoading(false)');
        setLoading(false);
      }
    }, 8000); // 8 secondes max

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 AuthProvider - Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 AuthProvider - Utilisateur connecté, récupération du profil...');
          
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (isMounted) {
              console.log('📄 AuthProvider - Profil récupéré:', profile);
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('❌ AuthProvider - Erreur dans fetchUserProfile:', error);
            if (isMounted) {
              setUserProfile(null);
            }
          }
        } else {
          console.log('❌ AuthProvider - Aucun utilisateur, profil effacé');
          if (isMounted) {
            setUserProfile(null);
          }
        }
        
        if (isMounted) {
          console.log('✅ AuthProvider - Fin du traitement auth state change, setLoading(false)');
          setLoading(false);
          clearTimeout(globalTimeout);
        }
      }
    );

    // THEN check for existing session
    console.log('🔍 AuthProvider - Vérification session existante...');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log('🔍 AuthProvider - Session existante trouvée:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 AuthProvider - Session existante avec utilisateur, récupération du profil...');
        
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (isMounted) {
            console.log('📄 AuthProvider - Profil session existante récupéré:', profile);
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('❌ AuthProvider - Erreur dans fetchUserProfile pour session existante:', error);
          if (isMounted) {
            setUserProfile(null);
          }
        }
      }
      
      if (isMounted) {
        console.log('✅ AuthProvider - Fin traitement session existante, setLoading(false)');
        setLoading(false);
        clearTimeout(globalTimeout);
      }
    }).catch((error) => {
      console.error('❌ AuthProvider - Erreur lors de getSession:', error);
      if (isMounted) {
        setLoading(false);
        clearTimeout(globalTimeout);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(globalTimeout);
      console.log('🧹 AuthProvider - Cleanup subscription');
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
