
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Pencil, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PermissionCheck } from '@/components/auth/PermissionCheck';

interface Intervention {
  id: string;
  equipment: string;
  technician: string;
  type: string;
  status: 'completed' | 'in-progress' | 'planned';
  duration: string;
  sector: string;
}

interface RecentInterventionsTableProps {
  interventions: Intervention[];
  isLoading: boolean;
}

export function RecentInterventionsTable({ interventions, isLoading }: RecentInterventionsTableProps) {
  const { toast } = useToast();

  const handleViewIntervention = (interventionId: string) => {
    toast({
      title: "✅ Détails intervention",
      description: `Ouverture des détails de l'intervention ${interventionId}`,
    });
  };

  const handleEditIntervention = (interventionId: string) => {
    toast({
      title: "✏️ Modification",
      description: `Modification de l'intervention ${interventionId}`,
    });
  };

  const handleDeleteIntervention = (interventionId: string) => {
    toast({
      title: "🗑️ Suppression",
      description: `L'intervention ${interventionId} a été supprimée.`,
      variant: "destructive",
    });
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          Interventions récentes par secteur
          <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
            {isLoading ? "..." : `${interventions.length} récentes`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs md:text-sm text-gray-600">
                <th className="py-4 px-6 font-semibold">ID Intervention</th>
                <th className="py-4 px-6 font-semibold hidden sm:table-cell">Équipement</th>
                <th className="py-4 px-6 font-semibold">Technicien</th>
                <th className="py-4 px-6 font-semibold hidden md:table-cell">Secteur</th>
                <th className="py-4 px-6 font-semibold hidden md:table-cell">Type</th>
                <th className="py-4 px-6 font-semibold">Statut</th>
                <th className="py-4 px-6 font-semibold hidden lg:table-cell">Durée</th>
                <th className="py-4 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-3/4 mx-auto" />
                      <Skeleton className="h-5 w-1/2 mx-auto" />
                      <Skeleton className="h-5 w-2/3 mx-auto" />
                    </div>
                  </td>
                </tr>
              ) : interventions.map((intervention, index) => (
                <tr key={intervention.id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs md:text-sm text-blue-600 cursor-pointer hover:underline font-semibold">
                      {intervention.id}
                    </span>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <span className="font-medium text-sm text-gray-900">{intervention.equipment}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">{intervention.technician}</td>
                  <td className="py-4 px-6 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {intervention.sector}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-xs md:text-sm text-gray-600 hidden md:table-cell">{intervention.type}</td>
                  <td className="py-4 px-6">
                    <Badge variant="secondary" className={`text-xs font-medium ${
                      intervention.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      intervention.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {intervention.status === 'completed' ? 'Terminé' :
                       intervention.status === 'in-progress' ? 'En cours' : 'Planifié'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-xs md:text-sm text-gray-600 hidden lg:table-cell font-medium">{intervention.duration}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                        onClick={() => handleViewIntervention(intervention.id)}
                      >
                        Voir
                      </Button>
                      <PermissionCheck allowedRoles={['admin', 'manager']}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:bg-yellow-50 hover:text-yellow-700"
                          onClick={() => handleEditIntervention(intervention.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteIntervention(intervention.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </PermissionCheck>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
