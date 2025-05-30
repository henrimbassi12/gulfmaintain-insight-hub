
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from '@/components/StatusBadge';
import { AddEquipmentForm } from '@/components/AddEquipmentForm';
import { useEquipments } from '@/hooks/useEquipments';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  User,
  Thermometer,
  Settings,
  Loader2
} from 'lucide-react';

export default function Equipments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { equipments, isLoading, refetch } = useEquipments();

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.equipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Équipements</h1>
          <p className="text-gray-600">Gestion et suivi de vos équipements frigorifiques</p>
        </div>
        <AddEquipmentForm onSuccess={refetch} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par ID, localisation, marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="operational">Opérationnel</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="offline">Hors ligne</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {equipments.filter(e => e.status === 'operational').length}
            </div>
            <div className="text-sm text-gray-600">Opérationnels</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {equipments.filter(e => e.status === 'maintenance').length}
            </div>
            <div className="text-sm text-gray-600">En maintenance</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {equipments.filter(e => e.status === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critiques</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {equipments.filter(e => e.status === 'offline').length}
            </div>
            <div className="text-sm text-gray-600">Hors ligne</div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipments.map((equipment) => (
          <Card key={equipment.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-blue-600">
                    {equipment.equipment_id}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{equipment.type}</p>
                </div>
                <StatusBadge status={equipment.status}>
                  {equipment.status === 'operational' ? 'Opérationnel' :
                   equipment.status === 'maintenance' ? 'Maintenance' :
                   equipment.status === 'critical' ? 'Critique' : 'Hors ligne'}
                </StatusBadge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Marque:</span>
                  <div className="font-medium">{equipment.brand} {equipment.model}</div>
                </div>
                <div>
                  <span className="text-gray-500">Température:</span>
                  <div className="font-medium flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {equipment.temperature || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{equipment.location}</span>
                </div>
                {equipment.technician && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{equipment.technician}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Prochaine maintenance: {formatDate(equipment.next_maintenance)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Détails
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipments.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              {equipments.length === 0 
                ? 'Aucun équipement trouvé. Ajoutez votre premier équipement!'
                : 'Aucun équipement trouvé avec ces critères.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
