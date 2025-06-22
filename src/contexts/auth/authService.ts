
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const createAuthService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentative de connexion pour:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Erreur de connexion:', error);
        
        // Messages d'erreur plus spécifiques
        let errorMessage = "Email ou mot de passe incorrect";
        
        if (error.message.includes('email_not_confirmed')) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (error.message.includes('invalid_credentials')) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes('too_many_requests')) {
          errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
        }
        
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.user && data.session) {
        console.log('✅ Connexion réussie avec session');
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
      } else if (data.user && !data.session) {
        console.log('⚠️ Utilisateur créé mais session manquante - email non confirmé');
        toast({
          title: "Email non confirmé",
          description: "Veuillez vérifier votre email et cliquer sur le lien de confirmation",
          variant: "destructive",
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
        
        let errorMessage = error.message;
        if (error.message.includes('already_registered')) {
          errorMessage = "Cette adresse email est déjà utilisée. Essayez de vous connecter.";
        }
        
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('✅ Inscription réussie:', data);
        
        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Inscription réussie",
            description: "Vérifiez votre email pour confirmer votre compte avant de vous connecter",
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

  return {
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
  };
};
