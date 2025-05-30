
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from '@/components/StatusBadge';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar,
  User,
  Thermometer,
  Settings
} from 'lucide-react';

export default function Equipments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const equipments = [
    {
      id: 'FR-2024-089',
      type: 'Réfrigérateur commercial',
      brand: 'Samsung',
      model: 'RF-450XL',
      location: 'Agence Casablanca Nord',
      agency: 'Casablanca',
      status: 'operational',
      technician: 'Ahmed Benali',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-03-15',
      temperature: '4°C',
      serialNumber: 'SAM789456123'
    },
    {
      id: 'FR-2024-012',
      type: 'Chambre froide',
      brand: 'LG',
      model: 'CF-1200',
      location: 'Agence Rabat Centre',
      agency: 'Rabat',
      status: 'maintenance',
      technician: 'Fatima Zahra',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-02-20',
      temperature: '2°C',
      serialNumber: 'LG456789321'
    },
    {
      id: 'FR-2024-134',
      type: 'Réfrigérateur commercial',
      brand: 'Whirlpool',
      model: 'WR-350L',
      location: 'Agence Marrakech Sud',
      agency: 'Marrakech',
      status: 'critical',
      technician: 'Mohamed Alami',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      temperature: '8°C',
      serialNumber: 'WP123654789'
    },
    {
      id: 'FR-2024-045',
      type: 'Congélateur vertical',
      brand: 'Bosch',
      model: 'BV-200F',
      location: 'Agence Tanger Port',
      agency: 'Tanger',
      status: 'offline',
      technician: 'Youssef Idrissi',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05',
      temperature: '-',
      serialNumber: 'BSH987321654'
    },
    {
      id: 'FR-2024-067',
      type: 'Réfrigérateur commercial',
      brand: 'Electrolux',
      model: 'EX-400C',
      location: 'Agence Fès Centre',
      agency: 'Fès',
      status: 'operational',
      technician: 'Aicha Benjelloun',
      lastMaintenance: '2024-01-18',
      nextMaintenance: '2024-03-18',
      temperature: '3°C',
      serialNumber: 'ELX654987321'
    }
  ];

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Équipements</h1>
          <p className="text-gray-600">Gestion et suivi de vos équipements frigorifiques</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel équipement
        </Button>
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
                    {equipment.id}
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
                    {equipment.temperature}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{equipment.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{equipment.technician}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Prochaine maintenance: {equipment.nextMaintenance}</span>
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

      {filteredEquipments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Aucun équipement trouvé avec ces critères.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
