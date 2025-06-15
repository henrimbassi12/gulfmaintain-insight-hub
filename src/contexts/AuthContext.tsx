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
      console.log('🔍 [DEBUG] Début fetchUserProfile pour userId:', userId);
      
      // Test de connexion à Supabase avec timeout
      console.log('🔗 [DEBUG] Test de connexion Supabase...');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout de 10 secondes')), 10000);
      });
      
      const supabasePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      console.log('🚀 [DEBUG] Lancement de la requête Supabase...');
      
      const result = await Promise.race([supabasePromise, timeoutPromise]);
      
      console.log('📊 [DEBUG] Résultat de la requête profiles reçu:', result);
      
      const { data, error } = result as any;
      
      console.log('📊 [DEBUG] Data:', data);
      console.log('📊 [DEBUG] Error:', error);
      
      if (error) {
        console.error('❌ [DEBUG] Erreur lors de la récupération du profil:', error);
        console.error('❌ [DEBUG] Code d\'erreur:', error.code);
        console.error('❌ [DEBUG] Message:', error.message);
        console.error('❌ [DEBUG] Détails complets:', JSON.stringify(error, null, 2));
        
        // Si le profil n'existe pas, on va le créer
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
          console.log('⚠️ [DEBUG] Profil inexistant, tentative de création...');
          
          const newProfileData = {
            id: userId,
            email: session?.user?.email || '',
            full_name: session?.user?.user_metadata?.full_name || 'EPANDA MBASSI HENRI SOREL',
            role: 'admin', // Forcer admin pour test
            account_status: 'approved' as 'approved'
          };
          
          console.log('📝 [DEBUG] Données du nouveau profil:', newProfileData);
          
          const createPromise = supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single();
            
          const createResult = await Promise.race([createPromise, timeoutPromise]);
          
          console.log('📊 [DEBUG] Résultat création profil:', createResult);
          
          const { data: newProfile, error: createError } = createResult as any;
            
          if (createError) {
            console.error('❌ [DEBUG] Erreur création profil:', createError);
            console.error('❌ [DEBUG] Détails création:', JSON.stringify(createError, null, 2));
            return null;
          }
          
          console.log('✅ [DEBUG] Profil créé avec succès:', newProfile);
          return newProfile;
        }
        
        return null;
      }
      
      console.log('✅ [DEBUG] Profil récupéré:', data);
      console.log('📊 [DEBUG] Statut du compte:', data?.account_status);
      console.log('🏷️ [DEBUG] Rôle utilisateur:', data?.role);
      return data;
    } catch (error) {
      console.error('❌ [DEBUG] Erreur catch dans fetchUserProfile:', error);
      if (error instanceof Error) {
        console.error('❌ [DEBUG] Message d\'erreur:', error.message);
        console.error('❌ [DEBUG] Stack trace:', error.stack);
      }
      return null;
    }
  };

  useEffect(() => {
    console.log('🚀 [DEBUG] Initialisation AuthProvider');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [DEBUG] Auth state change:', event, session?.user?.email);
        console.log('📝 [DEBUG] Session reçue:', session ? 'présente' : 'absente');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 [DEBUG] Utilisateur connecté, récupération du profil...');
          console.log('🆔 [DEBUG] User ID:', session.user.id);
          console.log('📧 [DEBUG] Email:', session.user.email);
          console.log('🏷️ [DEBUG] Metadata:', session.user.user_metadata);
          
          // Utiliser setTimeout pour éviter les deadlocks
          setTimeout(async () => {
            try {
              console.log('⏰ [DEBUG] Début timeout pour fetchUserProfile...');
              const profile = await fetchUserProfile(session.user.id);
              console.log('📋 [DEBUG] Profil final reçu dans timeout:', profile);
              setUserProfile(profile);
            } catch (error) {
              console.error('❌ [DEBUG] Erreur dans timeout fetchUserProfile:', error);
              setUserProfile(null);
            }
          }, 100);
        } else {
          console.log('❌ [DEBUG] Aucun utilisateur, profil effacé');
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🔍 [DEBUG] Session existante trouvée:', session?.user?.email);
      console.log('📝 [DEBUG] Session existante:', session ? 'présente' : 'absente');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 [DEBUG] Session existante, récupération du profil...');
        console.log('🆔 [DEBUG] User ID existant:', session.user.id);
        
        // Utiliser setTimeout ici aussi
        setTimeout(async () => {
          try {
            console.log('⏰ [DEBUG] Début timeout pour session existante...');
            const profile = await fetchUserProfile(session.user.id);
            console.log('📋 [DEBUG] Profil défini pour session existante:', profile);
            setUserProfile(profile);
          } catch (error) {
            console.error('❌ [DEBUG] Erreur session existante:', error);
            setUserProfile(null);
          }
        }, 100);
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
