
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from './userProfileService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Clé pour le stockage local du profil utilisateur
  const PROFILE_STORAGE_KEY = 'user_profile_cache';

  // Sauvegarder le profil en cache local
  const cacheUserProfile = (profile: any) => {
    if (profile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        ...profile,
        cached_at: Date.now()
      }));
    }
  };

  // Récupérer le profil du cache local
  const getCachedProfile = () => {
    try {
      const cached = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (cached) {
        const profile = JSON.parse(cached);
        // Vérifier que le cache n'est pas trop ancien (24h max)
        if (Date.now() - profile.cached_at < 24 * 60 * 60 * 1000) {
          console.log('📱 Profil utilisateur récupéré du cache local');
          return profile;
        }
      }
    } catch (error) {
      console.error('❌ Erreur lecture cache profil:', error);
    }
    return null;
  };

  useEffect(() => {
    console.log('🚀 AuthProvider - Initialisation');
    
    let isMounted = true;
    
    // Timeout de sécurité
    const globalTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log('⏰ AuthProvider - Timeout global, arrêt du loading');
        setLoading(false);
      }
    }, 8000);

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
            
            // Tenter de récupérer le profil depuis la base de données
            setTimeout(async () => {
              if (isMounted) {
                try {
                  const profile = await fetchUserProfile(session.user.id);
                  if (isMounted && profile) {
                    console.log('✅ Profil récupéré depuis la base de données');
                    setUserProfile(profile);
                    cacheUserProfile(profile);
                  } else {
                    // Si échec réseau, utiliser le cache
                    const cachedProfile = getCachedProfile();
                    if (cachedProfile) {
                      setUserProfile(cachedProfile);
                      console.log('⚠️ Utilisation du profil en cache (mode hors ligne)');
                    }
                  }
                } catch (error) {
                  console.error('❌ Erreur récupération profil:', error);
                  // Utiliser le cache en cas d'erreur
                  const cachedProfile = getCachedProfile();
                  if (cachedProfile) {
                    setUserProfile(cachedProfile);
                    console.log('⚠️ Utilisation du profil en cache (erreur réseau)');
                  }
                }
                
                setLoading(false);
                clearTimeout(globalTimeout);
              }
            }, 300);
          } else {
            console.log('❌ AuthProvider - Pas de session active');
            setUserProfile(null);
            // Nettoyer le cache lors de la déconnexion
            localStorage.removeItem(PROFILE_STORAGE_KEY);
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
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (isMounted && profile) {
              setUserProfile(profile);
              cacheUserProfile(profile);
            } else {
              // Utiliser le cache si disponible
              const cachedProfile = getCachedProfile();
              if (cachedProfile) {
                setUserProfile(cachedProfile);
              }
            }
          } catch (error) {
            console.error('❌ Erreur profil session existante:', error);
            // Utiliser le cache en cas d'erreur
            const cachedProfile = getCachedProfile();
            if (cachedProfile) {
              setUserProfile(cachedProfile);
            }
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
    setUserProfile,
  };
};
