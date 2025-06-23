import React, { useState, useMemo } from 'react';
import { EquipmentList } from '@/components/EquipmentList';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import MaintenanceFilters from '@/components/maintenance/MaintenanceFilters';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, FileText, ClipboardList, Truck, Wrench, Snowflake, Settings, RefreshCw, Activity, TrendingUp } from 'lucide-react';
import { RepairForm } from '@/components/forms/RepairForm';
import { MovementForm } from '@/components/forms/MovementForm';
import { MaintenanceTrackingForm } from '@/components/forms/MaintenanceTrackingForm';
import { RefrigeratorMaintenanceForm } from '@/components/forms/RefrigeratorMaintenanceForm';
import { useEquipments } from '@/hooks/useEquipments';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

export default function Maintenance() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isTrackingFormOpen, setIsTrackingFormOpen] = useState(false);
  const [isRefrigeratorFormOpen, setIsRefrigeratorFormOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    technician: 'all',
    status: 'all',
    agency: 'all',
    equipment: 'all',
    search: ''
  });

  const { equipments, isLoading } = useEquipments();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      technician: 'all',
      status: 'all',
      agency: 'all',
      equipment: 'all',
      search: ''
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast.success("Actualisation des données...");
    
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Données mises à jour avec succès");
    }, 1500);
  };

  const quickActions = [
    {
      id: 'repair',
      title: 'Réparation',
      tooltip: 'Nouvelle intervention de réparation',
      icon: Wrench,
      color: 'text-green-600',
      bgHover: 'hover:bg-green-50',
      borderHover: 'hover:border-green-200',
      action: () => {
        setIsRepairFormOpen(true);
        toast.success("Fiche de réparation ouverte");
      },
      isOpen: isRepairFormOpen
    },
    {
      id: 'movement',
      title: 'Mouvement',
      tooltip: 'Déplacement de frigo ou remplacement',
      icon: Truck,
      color: 'text-orange-600',
      bgHover: 'hover:bg-orange-50',
      borderHover: 'hover:border-orange-200',
      action: () => {
        setIsMovementFormOpen(true);
        toast.success("Fiche de mouvement ouverte");
      },
      isOpen: isMovementFormOpen
    },
    {
      id: 'tracking',
      title: 'Suivi',
      tooltip: 'Suivi d\'un équipement déjà réparé',
      icon: ClipboardList,
      color: 'text-purple-600',
      bgHover: 'hover:bg-purple-50',
      borderHover: 'hover:border-purple-200',
      action: () => {
        setIsTrackingFormOpen(true);
        toast.success("Fiche de suivi ouverte");
      },
      isOpen: isTrackingFormOpen
    },
    {
      id: 'refrigerator',
      title: 'Frigo',
      tooltip: 'Ajouter un nouveau frigo',
      icon: Snowflake,
      color: 'text-blue-600',
      bgHover: 'hover:bg-blue-50',
      borderHover: 'hover:border-blue-200',
      action: () => {
        setIsRefrigeratorFormOpen(true);
        toast.success("Fiche frigo ouverte");
      },
      isOpen: isRefrigeratorFormOpen
    },
    {
      id: 'report',
      title: 'Rapport',
      tooltip: 'Nouvelle fiche de rapport technique',
      icon: FileText,
      color: 'text-gray-600',
      bgHover: 'hover:bg-gray-50',
      borderHover: 'hover:border-gray-300',
      action: () => {
        toast.success("Création de rapport technique", {
          description: "Redirection vers la création de rapport..."
        });
      },
      isOpen: false
    },
    {
      id: 'analysis',
      title: 'Analyse',
      tooltip: 'Afficher les données d\'un équipement',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgHover: 'hover:bg-indigo-50',
      borderHover: 'hover:border-indigo-200',
      action: () => {
        toast.success("Analyse d'équipement", {
          description: "Sélectionnez un équipement pour l'analyser..."
        });
      },
      isOpen: false
    }
  ];

  // Filter equipments based on maintenance filters
  const filteredEquipments = useMemo(() => {
    return equipments.filter(equipment => {
      const matchesSearch = filters.search === '' || 
        equipment.equipment_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'all' || equipment.status === filters.status;
      const matchesAgency = filters.agency === 'all' || equipment.agency === filters.agency;
      const matchesTechnician = filters.technician === 'all' || equipment.technician === filters.technician;

      return matchesSearch && matchesStatus && matchesAgency && matchesTechnician;
    });
  }, [equipments, filters]);

  const handleSaveForm = (data: any) => {
    console.log('Saving form data:', data);
    toast.success("Maintenance créée avec succès");
  };

  const handleSaveRepairForm = (data: any) => {
    console.log('Saving repair form data:', data);
    toast.success("Fiche réparation enregistrée");
  };

  const handleSaveMovementForm = (data: any) => {
    console.log('Saving movement form data:', data);
    toast.success("Fiche mouvement enregistrée");
  };

  const handleSaveTrackingForm = (data: any) => {
    console.log('Saving tracking form data:', data);
    toast.success("Fiche suivi enregistrée");
  };

  const handleSaveRefrigeratorForm = (data: any) => {
    console.log('Saving refrigerator form data:', data);
    toast.success("Fiche frigo enregistrée");
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Maintenance"
        subtitle="Gestion et suivi des maintenances préventives et curatives"
        icon={Wrench}
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
          onClick={() => setIsFormOpen(true)}
          icon={Plus}
        >
          Nouvelle Maintenance
        </ModernButton>
      </AirbnbHeader>

      {/* Section Actions rapides améliorée */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Créer une fiche d'intervention
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              6 actions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <TooltipProvider>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Tooltip key={action.id}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={action.action}
                        disabled={action.isOpen}
                        variant="outline"
                        className={`
                          h-auto p-4 flex flex-col items-center gap-3 
                          border-2 border-gray-200 bg-white 
                          ${action.bgHover} ${action.borderHover}
                          transition-all duration-200 hover:shadow-lg
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${action.isOpen ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                        `}
                      >
                        <IconComponent className={`w-6 h-6 ${action.color}`} />
                        <div className="text-center">
                          <div className="font-semibold text-sm text-gray-800">
                            {action.title}
                          </div>
                          {action.isOpen && (
                            <div className="text-xs text-blue-600 mt-1">
                              Ouvert
                            </div>
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
      
      <MaintenanceFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      <EquipmentList 
        equipments={equipments}
        filteredEquipments={filteredEquipments}
        isLoading={isLoading}
      />

      {/* Modals */}
      <MaintenanceForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
      />

      <RepairForm 
        isOpen={isRepairFormOpen}
        onClose={() => setIsRepairFormOpen(false)}
        onSave={handleSaveRepairForm}
      />

      <MovementForm 
        isOpen={isMovementFormOpen}
        onClose={() => setIsMovementFormOpen(false)}
        onSave={handleSaveMovementForm}
      />

      <MaintenanceTrackingForm 
        isOpen={isTrackingFormOpen}
        onClose={() => setIsTrackingFormOpen(false)}
        onSave={handleSaveTrackingForm}
      />

      <RefrigeratorMaintenanceForm 
        isOpen={isRefrigeratorFormOpen}
        onClose={() => setIsRefrigeratorFormOpen(false)}
        onSave={handleSaveRefrigeratorForm}
      />
    </AirbnbContainer>
  );
}
