
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
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

      toast({
        title: "Utilisateur approuvé",
        description: "L'utilisateur a été approuvé avec succès",
      });

      fetchPendingUsers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
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

      toast({
        title: "Utilisateur rejeté",
        description: "L'utilisateur a été rejeté",
      });

      fetchPendingUsers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      technician: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Accès réservé aux administrateurs</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Validation des nouvelles inscriptions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Utilisateurs en attente ({pendingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun utilisateur en attente</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Agence</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'Non renseigné'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.agency || 'Non renseignée'}</TableCell>
                    <TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
