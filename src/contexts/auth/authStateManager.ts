
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from './userProfileService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthProvider - Initialisation');
    
    let isMounted = true;
    
    // Timeout de sécurité
    const globalTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log('⏰ AuthProvider - Timeout global, arrêt du loading');
        setLoading(false);
      }
    }, 8000); // Réduit à 8 secondes

    // Gestionnaire d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 AuthProvider - Auth state change:', event, {
          userEmail: session?.user?.email,
          hasSession: !!session,
          emailConfirmed: session?.user?.email_confirmed_at
        });
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('👤 AuthProvider - Utilisateur avec session active');
            
            // Récupération du profil avec délai pour s'assurer que la base de données est à jour
            setTimeout(async () => {
              if (isMounted) {
                const profile = await fetchUserProfile(session.user.id);
                if (isMounted) {
                  setUserProfile(profile);
                  setLoading(false);
                  clearTimeout(globalTimeout);
                }
              }
            }, 300); // Réduit le délai
          } else {
            console.log('❌ AuthProvider - Pas de session active');
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

    // Vérification de session existante avec gestion d'erreur améliorée
    const checkExistingSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de session:', error);
          if (isMounted) {
            setLoading(false);
            clearTimeout(globalTimeout);
          }
          return;
        }
        
        if (!isMounted) return;
        
        console.log('🔍 AuthProvider - Session existante:', {
          userEmail: session?.user?.email,
          hasSession: !!session,
          emailConfirmed: session?.user?.email_confirmed_at
        });
        
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
    };

    checkExistingSession();

    return () => {
      isMounted = false;
      clearTimeout(globalTimeout);
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    userProfile,
    loading,
  };
};
