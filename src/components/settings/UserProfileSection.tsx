
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from 'lucide-react';

interface UserProfileSectionProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  role: string;
  setRole: (value: string) => void;
  agency: string;
  setAgency: (value: string) => void;
  isAdmin: boolean;
  userProfile: any;
}

export function UserProfileSection({
  fullName,
  setFullName,
  email,
  role,
  setRole,
  agency,
  setAgency,
  isAdmin,
  userProfile
}: UserProfileSectionProps) {
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
  );
}
