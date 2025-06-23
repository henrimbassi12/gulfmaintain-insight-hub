
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, RefreshCw, User, Bell, Shield, Save, Eye, EyeOff } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NotificationSettings } from '@/components/NotificationSettings';

export default function Settings() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // États pour les champs du formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [agency, setAgency] = useState('');

  // État pour les notifications
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Nouveaux états pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vérifier si l'utilisateur est admin
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

    // Charger les préférences de notifications depuis localStorage
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

      // Si l'utilisateur est admin, permettre la modification du rôle
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

      // Sauvegarder les préférences de notifications dans localStorage
      localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));
      
      // Recharger le profil pour s'assurer que les données sont à jour
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

    // Validation des champs
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
      // 1. Vérifier le mot de passe actuel en tentant une connexion temporaire
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Le mot de passe actuel est incorrect");
        return;
      }
      
      // 2. Si le mot de passe actuel est correct, mettre à jour avec le nouveau
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('Erreur lors du changement de mot de passe:', updateError);
        toast.error("Erreur lors du changement de mot de passe: " + updateError.message);
      } else {
        toast.success("Mot de passe modifié avec succès !");
        // Réinitialiser les champs
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

  const getRoleLabel = (roleValue: string) => {
    switch (roleValue) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Gestionnaire';
      case 'technician':
        return 'Technicien';
      default:
        return roleValue;
    }
  };

  const getStatusBadge = () => {
    if (!userProfile) return { text: 'Chargement...', variant: 'secondary' as const };
    
    switch (userProfile.account_status) {
      case 'approved':
        return { text: 'Approuvé', variant: 'default' as const };
      case 'pending':
        return { text: 'En attente', variant: 'secondary' as const };
      case 'rejected':
        return { text: 'Rejeté', variant: 'destructive' as const };
      default:
        return { text: 'Inconnu', variant: 'secondary' as const };
    }
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Paramètres"
        subtitle="Configuration de votre compte et préférences"
        icon={SettingsIcon}
      >
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
      </AirbnbHeader>

      {/* Aperçu du profil */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Profil utilisateur
            <Badge variant={getStatusBadge().variant} className="ml-auto text-xs">
              {getStatusBadge().text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input 
                  id="name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1"
                  placeholder="Entrez votre nom complet" 
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  disabled
                  className="mt-1 bg-gray-50" 
                />
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Rôle</Label>
                {isAdmin ? (
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="manager">Gestionnaire</SelectItem>
                      <SelectItem value="technician">Technicien</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <Input 
                      id="role" 
                      value={getRoleLabel(role)}
                      disabled
                      className="mt-1 bg-gray-50" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Le rôle est géré par l'administrateur</p>
                  </>
                )}
                {isAdmin && (
                  <p className="text-xs text-green-600 mt-1">En tant qu'administrateur, vous pouvez modifier votre rôle</p>
                )}
              </div>
              <div>
                <Label htmlFor="agency">Région</Label>
                <Select value={agency} onValueChange={setAgency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non-assigne">Non assigné</SelectItem>
                    <SelectItem value="Littoral">Littoral</SelectItem>
                    <SelectItem value="Ouest">Ouest</SelectItem>
                    <SelectItem value="Nord">Nord</SelectItem>
                    <SelectItem value="Sud-Ouest">Sud-Ouest</SelectItem>
                    <SelectItem value="Nord-Ouest">Nord-Ouest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration des notifications */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Paramètres de notification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Composant pour les notifications push */}
            <NotificationSettings onTogglePush={(enabled) => {
              console.log('Notifications push:', enabled ? 'activées' : 'désactivées');
            }} />
            
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Alertes par email</h4>
                  <p className="text-sm text-gray-500">Notifications importantes par email</p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sécurité - Changement de mot de passe */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Mot de passe actuel *</Label>
              <div className="relative mt-1">
                <Input 
                  id="current-password" 
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loadingPassword}
                  placeholder="Entrez votre mot de passe actuel"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password">Nouveau mot de passe *</Label>
              <div className="relative mt-1">
                <Input 
                  id="new-password" 
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loadingPassword}
                  placeholder="Entrez votre nouveau mot de passe (min. 6 caractères)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmer le mot de passe *</Label>
              <div className="relative mt-1">
                <Input 
                  id="confirm-password" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loadingPassword}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="pt-2">
              <ModernButton 
                onClick={handleChangePassword} 
                disabled={loadingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full md:w-auto"
              >
                {loadingPassword ? 'Changement en cours...' : 'Changer le mot de passe'}
              </ModernButton>
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className="text-sm text-orange-600">Le mot de passe doit contenir au moins 6 caractères</p>
            )}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-600">Les mots de passe ne correspondent pas</p>
            )}
          </div>
        </CardContent>
      </Card>
    </AirbnbContainer>
  );
}
