import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, RefreshCw, Save } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileSection } from '@/components/settings/UserProfileSection';
import { NotificationSection } from '@/components/settings/NotificationSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { UserManagementSection } from '@/components/settings/UserManagementSection';

export default function Settings() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // États pour les champs du formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [agency, setAgency] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Nouveaux états pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isAdmin = userProfile?.role === 'admin' && userProfile?.account_status === 'approved';

  // Charger les données utilisateur
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setEmail(userProfile.email || '');
      setRole(userProfile.role || 'technician');
      setAgency(userProfile.agency || 'non-assigne');
    } else if (user) {
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      setRole(user.user_metadata?.role || 'technician');
    }

    const savedEmailNotifications = localStorage.getItem('emailNotifications');
    if (savedEmailNotifications !== null) {
      setEmailNotifications(JSON.parse(savedEmailNotifications));
    }
  }, [user, userProfile]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
      toast.success('Paramètres actualisés avec succès');
    } catch (error) {
      console.error('Erreur lors du rechargement du profil:', error);
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }
    
    if (!fullName.trim()) {
      toast.error('Le nom complet est requis');
      return;
    }
    
    setLoading(true);
    try {
      const agencyValue = agency === 'non-assigne' ? null : agency;
      
      const updateData: any = {
        full_name: fullName.trim(),
        agency: agencyValue
      };

      if (isAdmin) {
        updateData.role = role;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        toast.error('Erreur lors de la sauvegarde: ' + error.message);
        return;
      }

      localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));
      await refreshProfile();
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur inattendue lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) {
      toast.error('Utilisateur non connecté');
      return;
    }

    if (!currentPassword.trim()) {
      toast.error("Le mot de passe actuel est requis");
      return;
    }
    
    if (!newPassword.trim()) {
      toast.error("Le nouveau mot de passe est requis");
      return;
    }
    
    if (!confirmPassword.trim()) {
      toast.error("La confirmation du mot de passe est requise");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Le nouveau mot de passe et la confirmation ne correspondent pas");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    setLoadingPassword(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Le mot de passe actuel est incorrect");
        return;
      }
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('Erreur lors du changement de mot de passe:', updateError);
        toast.error("Erreur lors du changement de mot de passe: " + updateError.message);
      } else {
        toast.success("Mot de passe modifié avec succès !");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error("Une erreur inattendue s'est produite: " + error.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Paramètres"
        subtitle="Configuration de votre compte et préférences"
        icon={SettingsIcon}
      >
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ModernButton 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            icon={RefreshCw}
            className={refreshing ? 'animate-spin' : ''}
          >
            Actualiser
          </ModernButton>
          
          <ModernButton 
            onClick={handleSaveSettings}
            disabled={loading}
            icon={Save}
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </ModernButton>
        </div>
      </AirbnbHeader>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          )}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile" className="space-y-6">
            <UserProfileSection
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              role={role}
              setRole={setRole}
              agency={agency}
              setAgency={setAgency}
              isAdmin={isAdmin}
              userProfile={userProfile}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSection
              emailNotifications={emailNotifications}
              setEmailNotifications={setEmailNotifications}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySection
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              loadingPassword={loadingPassword}
              handleChangePassword={handleChangePassword}
            />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <UserManagementSection userProfile={userProfile} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </AirbnbContainer>
  );
}
