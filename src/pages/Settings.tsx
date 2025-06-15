import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, RefreshCw, User, Bell, Shield, Save } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function Settings() {
  const { user, userProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // États pour les champs du formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [agency, setAgency] = useState('');

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
  }, [user, userProfile]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Recharger le profil utilisateur
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erreur lors du rechargement du profil:', error);
          toast.error('Erreur lors de l\'actualisation');
        } else {
          toast.success('Paramètres actualisés avec succès');
          // Les données seront automatiquement mises à jour via AuthContext
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const agencyValue = agency === 'non-assigne' ? null : agency;
      
      const updateData: any = {
        full_name: fullName,
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
        toast.error('Erreur lors de la sauvegarde');
      } else {
        toast.success('Paramètres sauvegardés avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
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
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1" 
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

      {/* Notifications Push */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Notifications Push
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Notifications push</h4>
                <p className="text-sm text-gray-500">Recevoir des notifications sur le bureau</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Alertes par email</h4>
                <p className="text-sm text-gray-500">Notifications importantes par email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Rappels de maintenance</h4>
                <p className="text-sm text-gray-500">Alertes automatiques de maintenance</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
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
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" className="mt-1" />
            </div>
            <ModernButton disabled>
              Changer le mot de passe
            </ModernButton>
            <p className="text-xs text-gray-500">Fonctionnalité à venir</p>
          </div>
        </CardContent>
      </Card>
    </AirbnbContainer>
  );
}
