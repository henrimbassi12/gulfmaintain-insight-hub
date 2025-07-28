
import { supabase } from '@/integrations/supabase/client';

export const fetchUserProfile = async (userId: string): Promise<any> => {
  try {
    // Log only in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 fetchUserProfile - Récupération pour userId:', userId);
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('❌ fetchUserProfile - Erreur:', error);
      return null;
    }
    
    // Don't log sensitive user data in production
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ fetchUserProfile - Profil récupéré');
    }
    return data;
  } catch (error) {
    console.error('❌ fetchUserProfile - Erreur catch:', error);
    return null;
  }
};
