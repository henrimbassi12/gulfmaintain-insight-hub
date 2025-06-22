
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

  return {
    user,
    session,
    userProfile,
    loading,
  };
};
