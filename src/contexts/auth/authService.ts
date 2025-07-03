import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const createAuthService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log('🔐 Tentative de connexion pour:', email, { rememberMe });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Configurer la persistance de session selon "Se souvenir de moi"
          ...(rememberMe && { 
            data: { 
              remember_me: true 
            } 
          })
        }
      });
      
      if (error) {
        console.error('❌ Erreur de connexion:', error);
        
        // Messages d'erreur plus spécifiques et toujours affichés
        let errorMessage = "Email ou mot de passe incorrect";
        
        if (error.message.includes('email_not_confirmed')) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (error.message.includes('invalid_credentials') || error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect. Veuillez vérifier vos informations.";
        } else if (error.message.includes('too_many_requests')) {
          errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
        } else if (error.message.includes('signup_disabled')) {
          errorMessage = "L'inscription est temporairement désactivée";
        }
        
        // TOUJOURS afficher l'erreur, même pour des mots de passe incorrects
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error };
      } else if (data.user && data.session) {
        console.log('✅ Connexion réussie avec session');
        
        // Configurer la durée de session selon "Se souvenir de moi"
        if (rememberMe) {
          // Étendre la durée de session à 30 jours
          localStorage.setItem('supabase.remember_me', 'true');
        } else {
          // Session normale (expire à la fermeture du navigateur)
          localStorage.removeItem('supabase.remember_me');
        }
        
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
      const errorMessage = error.message?.includes('Invalid login credentials') 
        ? "Email ou mot de passe incorrect. Veuillez vérifier vos informations."
        : "Une erreur inattendue s'est produite";
        
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
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
      localStorage.removeItem('supabase.remember_me');
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

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 Demande de réinitialisation de mot de passe pour:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Erreur réinitialisation:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer l'email de réinitialisation. Vérifiez votre adresse email.",
          variant: "destructive",
        });
        return { error };
      }

      console.log('✅ Email de réinitialisation envoyé');
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erreur catch resetPassword:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le mot de passe",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
  };
};
