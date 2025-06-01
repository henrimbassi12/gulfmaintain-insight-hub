
import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [userSettings, setUserSettings] = useState({
    name: "Tech Manager",
    email: "manager@gulfmaintain.com",
    phone: "+33 1 23 45 67 89",
    role: "Gestionnaire",
    timezone: "Europe/Paris",
    language: "fr"
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    urgentOnly: false
  });

  const [systemSettings, setSystemSettings] = useState({
    autoAssignTechnicians: true,
    enableAIPredictions: true,
    defaultPriority: "normale",
    sessionTimeout: "8",
    maintenanceReminders: true
  });

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSystemChange = (key: string, value: boolean | string) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Configuration de votre compte et préférences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profil utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Profil utilisateur
            </CardTitle>
            <CardDescription>Informations personnelles et contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={userSettings.name}
                onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userSettings.email}
                onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={userSettings.phone}
                onChange={(e) => setUserSettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select value={userSettings.timezone} onValueChange={(value) => setUserSettings(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                  <SelectItem value="Africa/Tunis">Africa/Tunis (GMT+1)</SelectItem>
                  <SelectItem value="Africa/Casablanca">Africa/Casablanca (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Notifications
            </CardTitle>
            <CardDescription>Gérer vos préférences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes email</Label>
                <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) => handleNotificationChange('emailAlerts', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes SMS</Label>
                <p className="text-sm text-gray-500">Notifications urgentes par SMS</p>
              </div>
              <Switch
                checked={notifications.smsAlerts}
                onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications push</Label>
                <p className="text-sm text-gray-500">Notifications dans le navigateur</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-gray-500">Résumé d'activité chaque semaine</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Urgences uniquement</Label>
                <p className="text-sm text-gray-500">Seules les interventions critiques</p>
              </div>
              <Switch
                checked={notifications.urgentOnly}
                onCheckedChange={(checked) => handleNotificationChange('urgentOnly', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Préférences système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-green-500" />
              Préférences système
            </CardTitle>
            <CardDescription>Configuration générale de l'application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Attribution automatique</Label>
                <p className="text-sm text-gray-500">Assigner automatiquement les techniciens</p>
              </div>
              <Switch
                checked={systemSettings.autoAssignTechnicians}
                onCheckedChange={(checked) => handleSystemChange('autoAssignTechnicians', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Prédictions IA</Label>
                <p className="text-sm text-gray-500">Activer les alertes prédictives</p>
              </div>
              <Switch
                checked={systemSettings.enableAIPredictions}
                onCheckedChange={(checked) => handleSystemChange('enableAIPredictions', checked)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Priorité par défaut</Label>
              <Select value={systemSettings.defaultPriority} onValueChange={(value) => handleSystemChange('defaultPriority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible">Faible</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="élevée">Élevée</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Délai de session (heures)</Label>
              <Select value={systemSettings.sessionTimeout} onValueChange={(value) => handleSystemChange('sessionTimeout', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le délai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 heures</SelectItem>
                  <SelectItem value="4">4 heures</SelectItem>
                  <SelectItem value="8">8 heures</SelectItem>
                  <SelectItem value="24">24 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Rappels de maintenance</Label>
                <p className="text-sm text-gray-500">Notifications préventives automatiques</p>
              </div>
              <Switch
                checked={systemSettings.maintenanceReminders}
                onCheckedChange={(checked) => handleSystemChange('maintenanceReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Sécurité
            </CardTitle>
            <CardDescription>Paramètres de sécurité et confidentialité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <Input type="password" placeholder="Entrez votre mot de passe actuel" />
            </div>
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input type="password" placeholder="Nouveau mot de passe" />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le mot de passe</Label>
              <Input type="password" placeholder="Confirmer le nouveau mot de passe" />
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Sessions actives</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Navigateur actuel</p>
                    <p className="text-gray-500">Chrome sur Windows - IP: 192.168.1.10</p>
                  </div>
                  <span className="text-green-600 text-xs">Actuelle</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Application mobile</p>
                    <p className="text-gray-500">iPhone - Dernière activité: il y a 2h</p>
                  </div>
                  <Button variant="outline" size="sm">Déconnecter</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline">
          Annuler
        </Button>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder les modifications
        </Button>
      </div>
    </div>
  );
};

export default Settings;
