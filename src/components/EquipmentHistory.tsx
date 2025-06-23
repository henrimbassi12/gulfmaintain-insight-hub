import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Search, Calendar, User, MapPin, Wrench, Clock, AlertCircle, X } from 'lucide-react';
import { PermissionCheck } from '@/components/auth/PermissionCheck';

interface HistoryEvent {
  id: string;
  date: string;
  time: string;
  type: string;
  equipment: string;
  technician: string;
  location: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
  duration?: string;
  cost?: number;
  priority: 'low' | 'medium' | 'high';
}

const mockHistory: HistoryEvent[] = [
  {
    id: '1',
    date: '2024-01-31',
    time: '14:30',
    type: 'Maintenance préventive',
    equipment: 'Frigo Commercial FC-001',
    technician: 'CÉDRIC',
    location: 'Douala Centre',
    description: 'Maintenance trimestrielle - Nettoyage condenseur, vérification gaz',
    status: 'completed',
    duration: '2h 30min',
    cost: 25000,
    priority: 'medium'
  },
  {
    id: '2',
    date: '2024-01-30',
    time: '09:15',
    type: 'Réparation urgente',
    equipment: 'Climatiseur Split AC-015',
    technician: 'VOUKENG',
    location: 'Bonapriso',
    description: 'Panne compresseur - Remplacement unité complète',
    status: 'completed',
    duration: '4h 15min',
    cost: 180000,
    priority: 'high'
  },
  {
    id: '3',
    date: '2024-01-29',
    time: '11:00',
    type: 'Installation',
    equipment: 'Réfrigérateur RF-032',
    technician: 'NDJOKO IV',
    location: 'Akwa',
    description: 'Installation nouveau réfrigérateur - Mise en service',
    status: 'completed',
    duration: '1h 45min',
    cost: 15000,
    priority: 'low'
  },
  {
    id: '4',
    date: '2024-01-29',
    time: '08:30',
    type: 'Diagnostic',
    equipment: 'Frigo Vitrine FV-008',
    technician: 'MBAPBOU GRÉGOIRE',
    location: 'Bonanjo',
    description: 'Diagnostic problème température - En attente pièces',
    status: 'pending',
    duration: '1h 00min',
    cost: 8000,
    priority: 'medium'
  },
  {
    id: '5',
    date: '2024-01-28',
    time: '16:45',
    type: 'Maintenance corrective',
    equipment: 'Climatiseur Central CC-003',
    technician: 'TCHINDA CONSTANT',
    location: 'Bali',
    description: 'Réparation fuite circuit frigorifique',
    status: 'cancelled',
    duration: '-',
    cost: 0,
    priority: 'high'
  }
];

export function EquipmentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTechnician, setFilterTechnician] = useState('');

  const filteredHistory = mockHistory.filter(event => {
    const matchesSearch = event.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || event.type === filterType;
    const matchesStatus = !filterStatus || event.status === filterStatus;
    const matchesTechnician = !filterTechnician || event.technician === filterTechnician;
    
    return matchesSearch && matchesType && matchesStatus && matchesTechnician;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const clearFilter = (filterName: string) => {
    switch (filterName) {
      case 'type':
        setFilterType('');
        break;
      case 'status':
        setFilterStatus('');
        break;
      case 'technician':
        setFilterTechnician('');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card className="bg-white border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Filtres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Rechercher équipement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="relative">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'intervention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance-preventive">Maintenance préventive</SelectItem>
                  <SelectItem value="reparation-urgente">Réparation urgente</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="maintenance-corrective">Maintenance corrective</SelectItem>
                </SelectContent>
              </Select>
              {filterType && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter('type')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              {filterStatus && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter('status')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Select value={filterTechnician} onValueChange={setFilterTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Technicien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CÉDRIC">CÉDRIC</SelectItem>
                  <SelectItem value="VOUKENG">VOUKENG</SelectItem>
                  <SelectItem value="NDJOKO IV">NDJOKO IV</SelectItem>
                  <SelectItem value="MBAPBOU GRÉGOIRE">MBAPBOU GRÉGOIRE</SelectItem>
                  <SelectItem value="TCHINDA CONSTANT">TCHINDA CONSTANT</SelectItem>
                </SelectContent>
              </Select>
              {filterTechnician && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter('technician')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline des événements */}
      <Card className="bg-white border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Historique des interventions
            <Badge variant="secondary" className="ml-auto">
              {filteredHistory.length} événements
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun événement trouvé</p>
              </div>
            ) : (
              filteredHistory.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Ligne de timeline */}
                  {index < filteredHistory.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  <div className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                    {/* Icône de timeline */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getPriorityColor(event.priority)} bg-gray-50 border-2`}>
                        {getPriorityIcon(event.priority)}
                      </div>
                    </div>
                    
                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{event.equipment}</h3>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date} à {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{event.technician}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.duration || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        
                        <PermissionCheck 
                          allowedRoles={['admin']}
                          fallback={null}
                        >
                          {event.cost !== undefined && (
                            <div className="text-sm font-medium text-blue-600">
                              Coût: {event.cost.toLocaleString()} FCFA
                            </div>
                          )}
                        </PermissionCheck>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
