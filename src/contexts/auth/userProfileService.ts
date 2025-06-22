
import { supabase } from '@/integrations/supabase/client';

export const fetchUserProfile = async (userId: string): Promise<any> => {
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
