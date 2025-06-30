
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserManagementSectionProps {
  userProfile: any;
}

export function UserManagementSection({ userProfile }: UserManagementSectionProps) {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_users')
        .select('*');
      
      if (error) {
        console.error('Erreur:', error);
        return;
      }
      
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('approve_user', {
        user_id: userId,
        approver_id: userProfile?.id
      });

      if (error) {
        throw error;
      }

      toast.success('Utilisateur approuvé avec succès');
      fetchPendingUsers();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('reject_user', {
        user_id: userId,
        approver_id: userProfile?.id
      });

      if (error) {
        throw error;
      }

      toast.success('Utilisateur rejeté');
      fetchPendingUsers();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      technician: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-lg text-gray-900 dark:text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          Gestion des utilisateurs
          {pendingUsers.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {pendingUsers.length} en attente
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucun utilisateur en attente</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Les nouvelles demandes d'inscription apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Utilisateurs en attente de validation ({pendingUsers.length})
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900 dark:text-gray-100">Nom</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Email</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Rôle</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Agence</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Date</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {user.full_name || 'Non renseigné'}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadge(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{user.agency || 'Non renseignée'}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(user.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
