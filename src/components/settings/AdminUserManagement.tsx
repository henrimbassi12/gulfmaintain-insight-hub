import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Edit, Eye, EyeOff, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  agency: string | null;
  account_status: 'pending' | 'approved' | 'rejected' | null;
  created_at: string;
}

interface AdminUserManagementProps {
  currentUserProfile: any;
}

export function AdminUserManagement({ currentUserProfile }: AdminUserManagementProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingPassword, setEditingPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    role: '',
    agency: ''
  });

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, agency, account_status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || '',
      role: user.role,
      agency: user.agency || 'non-assigne'
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const updateData: any = {
        full_name: editForm.full_name.trim(),
        agency: editForm.agency === 'non-assigne' ? null : editForm.agency
      };

      // Seuls les admins peuvent modifier les rôles
      if (currentUserProfile?.role === 'admin') {
        updateData.role = editForm.role;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', editingUser.id);

      if (error) throw error;

      toast.success('Utilisateur mis à jour avec succès');
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleChangeUserPassword = async () => {
    if (!editingPassword || !newPassword || newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      // Pour changer le mot de passe d'un autre utilisateur, nous devons utiliser l'API Admin
      const { error } = await supabase.auth.admin.updateUserById(editingPassword, {
        password: newPassword
      });

      if (error) {
        // Si l'API admin n'est pas disponible, on utilise la méthode de réinitialisation
        const user = users.find(u => u.id === editingPassword);
        if (user) {
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (resetError) throw resetError;
          toast.success('Email de réinitialisation envoyé à l\'utilisateur');
        }
      } else {
        toast.success('Mot de passe modifié avec succès');
      }

      setEditingPassword(null);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error('Erreur lors du changement de mot de passe');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Gestionnaire';
      case 'technician': return 'Technicien';
      default: return role;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Approuvé</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-lg text-gray-900 dark:text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          Gestion des utilisateurs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {user.full_name || 'Nom non défini'}
                  </h3>
                  {getStatusBadge(user.account_status)}
                  <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                {user.agency && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Région: {user.agency}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier l'utilisateur</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nom complet</Label>
                        <Input
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          placeholder="Nom complet"
                        />
                      </div>

                      {/* Seuls les admins peuvent modifier les rôles d'autres utilisateurs */}
                      {currentUserProfile?.role === 'admin' && (
                        <div>
                          <Label>Rôle</Label>
                          <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technician">Technicien</SelectItem>
                              <SelectItem value="manager">Gestionnaire</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Région</Label>
                        <Select value={editForm.agency} onValueChange={(value) => setEditForm({ ...editForm, agency: value })}>
                          <SelectTrigger>
                            <SelectValue />
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

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingUser(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                        <Button onClick={handleSaveUser}>
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPassword(user.id)}
                    >
                      Mot de passe
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Changer le mot de passe</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Changement du mot de passe pour: <strong>{user.full_name || user.email}</strong>
                      </p>
                      
                      <div>
                        <Label>Nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nouveau mot de passe (min. 6 caractères)"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Confirmer le mot de passe</Label>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmer le nouveau mot de passe"
                        />
                      </div>

                      {newPassword && newPassword.length < 6 && (
                        <p className="text-sm text-orange-600">Le mot de passe doit contenir au moins 6 caractères</p>
                      )}
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-sm text-red-600">Les mots de passe ne correspondent pas</p>
                      )}

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPassword(null);
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handleChangeUserPassword}
                          disabled={!newPassword || newPassword !== confirmPassword || newPassword.length < 6}
                        >
                          Changer le mot de passe
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}