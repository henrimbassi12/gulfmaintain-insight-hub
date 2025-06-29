
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, TrendingUp, BarChart3, PieChart, Calendar, MapPin, Users, Wrench } from "lucide-react";
import { toast } from 'sonner';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'reports' | 'analysis';
}

export function QuickActionsModal({ isOpen, onClose, type = 'reports' }: QuickActionsModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const reportsData = [
    {
      id: 'maintenance-monthly',
      title: 'Rapport mensuel de maintenance',
      description: 'Synthèse des maintenances du mois',
      icon: Calendar,
      size: '2.3 MB',
      lastGenerated: '2024-01-28'
    },
    {
      id: 'equipment-status',
      title: 'État des équipements',
      description: 'Statut actuel de tous les équipements',
      icon: BarChart3,
      size: '1.8 MB',
      lastGenerated: '2024-01-28'
    },
    {
      id: 'technician-performance',
      title: 'Performance des techniciens',
      description: 'Analyse des performances par technicien',
      icon: TrendingUp,
      size: '3.1 MB',
      lastGenerated: '2024-01-27'
    },
    {
      id: 'costs-analysis',
      title: 'Analyse des coûts',
      description: 'Répartition et évolution des coûts',
      icon: PieChart,
      size: '2.7 MB',
      lastGenerated: '2024-01-26'
    }
  ];

  const analysisData = [
    {
      id: 'predictive-maintenance',
      title: 'Maintenance prédictive',
      description: 'Prédictions IA pour les pannes futures',
      icon: TrendingUp,
      accuracy: '94%',
      lastUpdated: '2024-01-28'
    },
    {
      id: 'efficiency-trends',
      title: 'Tendances d\'efficacité',
      description: 'Évolution de l\'efficacité opérationnelle',
      icon: BarChart3,
      accuracy: '89%',
      lastUpdated: '2024-01-27'
    },
    {
      id: 'cost-optimization',
      title: 'Optimisation des coûts',
      description: 'Recommandations pour réduire les coûts',
      icon: PieChart,
      accuracy: '91%',
      lastUpdated: '2024-01-26'
    }
  ];

  // Nouvelles actions disponibles pour remplacer les boutons supprimés
  const quickActionsData = [
    {
      id: 'assign-technician',
      title: 'Assigner technicien',
      description: 'Affecter automatiquement un technicien',
      icon: Users,
      status: 'Disponible',
      lastUsed: 'Jamais'
    },
    {
      id: 'create-intervention',
      title: 'Nouvelle intervention',
      description: 'Créer une intervention d\'urgence',
      icon: Wrench,
      status: 'Prêt',
      lastUsed: '2024-01-28'
    },
    {
      id: 'locate-equipment',
      title: 'Localiser équipement',
      description: 'Trouver la position d\'un équipement',
      icon: MapPin,
      status: 'Actif',
      lastUsed: '2024-01-28'
    }
  ];

  const data = type === 'reports' ? reportsData : type === 'analysis' ? analysisData : quickActionsData;
  const title = type === 'reports' ? 'Rapports disponibles' : type === 'analysis' ? 'Analyses disponibles' : 'Actions rapides disponibles';

  const handleToggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleExecuteSelected = () => {
    if (selectedItems.length === 0) {
      toast.error('Veuillez sélectionner au moins un élément');
      return;
    }

    const selectedNames = data
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.title)
      .join(', ');

    if (type === 'reports' || type === 'analysis') {
      toast.success(`Exportation en cours: ${selectedNames}`);
    } else {
      toast.success(`Exécution en cours: ${selectedNames}`);
    }
    onClose();
  };

  const handleExecuteAll = () => {
    const actionText = type === 'reports' || type === 'analysis' ? 'Exportation' : 'Exécution';
    const itemType = type === 'reports' ? 'rapports' : type === 'analysis' ? 'analyses' : 'actions';
    toast.success(`${actionText} de toutes les ${itemType} en cours`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Sélectionnez les éléments à {type === 'reports' || type === 'analysis' ? 'exporter' : 'exécuter'}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExecuteSelected}
                disabled={selectedItems.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                {type === 'reports' || type === 'analysis' ? 'Exporter' : 'Exécuter'} sélection ({selectedItems.length})
              </Button>
              <Button onClick={handleExecuteAll}>
                <Download className="w-4 h-4 mr-2" />
                {type === 'reports' || type === 'analysis' ? 'Exporter' : 'Exécuter'} tout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item) => {
              const IconComponent = item.icon;
              const isSelected = selectedItems.includes(item.id);
              
              return (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleToggleSelection(item.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge className="bg-blue-500">
                          Sélectionné
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      {type === 'reports' ? (
                        <>
                          <span>Taille: {item.size}</span>
                          <span>Généré le: {item.lastGenerated}</span>
                        </>
                      ) : type === 'analysis' ? (
                        <>
                          <span>Précision: {item.accuracy}</span>
                          <span>MAJ: {item.lastUpdated}</span>
                        </>
                      ) : (
                        <>
                          <span>Statut: {item.status}</span>
                          <span>Utilisé: {item.lastUsed}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
