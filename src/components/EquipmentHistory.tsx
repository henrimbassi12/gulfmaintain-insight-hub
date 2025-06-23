
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Filter, X, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface HistoryEntry {
  id: string;
  equipmentId: string;
  equipmentName: string;
  action: string;
  technician: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  details: string;
  cost: string;
  duration: string;
  location: string;
}

const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    equipmentId: 'EQ001',
    equipmentName: 'Réfrigérateur Commercial A1',
    action: 'Maintenance préventive',
    technician: 'Jean Dupont',
    date: '2024-01-15',
    status: 'completed',
    details: 'Vérification du système de refroidissement, nettoyage des condenseurs',
    cost: '45,000 FCFA',
    duration: '2h 30min',
    location: 'Douala - Zone Industrielle'
  },
  {
    id: '2',
    equipmentId: 'EQ002',
    equipmentName: 'Climatiseur Bureau B2',
    action: 'Réparation',
    technician: 'Marie Ngono',
    date: '2024-01-14',
    status: 'completed',
    details: 'Remplacement du compresseur défaillant',
    cost: '125,000 FCFA',
    duration: '4h 15min',
    location: 'Yaoundé - Centre-ville'
  },
  {
    id: '3',
    equipmentId: 'EQ003',
    equipmentName: 'Groupe électrogène C3',
    action: 'Installation',
    technician: 'Paul Kamdem',
    date: '2024-01-13',
    status: 'pending',
    details: 'Installation et configuration initiale',
    cost: '89,500 FCFA',
    duration: '6h 00min',
    location: 'Bafoussam - Industrial'
  },
  {
    id: '4',
    equipmentId: 'EQ004',
    equipmentName: 'Système CVC D4',
    action: 'Diagnostic',
    technician: 'Sophie Tchounga',
    date: '2024-01-12',
    status: 'failed',
    details: 'Diagnostic complet du système de ventilation',
    cost: '32,000 FCFA',
    duration: '1h 45min',
    location: 'Douala - Bonabéri'
  }
];

export function EquipmentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [filteredHistory, setFilteredHistory] = useState(mockHistory);

  React.useEffect(() => {
    let filtered = mockHistory;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    if (actionFilter) {
      filtered = filtered.filter(entry => entry.action === actionFilter);
    }

    setFilteredHistory(filtered);
  }, [searchTerm, statusFilter, actionFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Échec</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setActionFilter('');
  };

  const hasActiveFilters = searchTerm || statusFilter || actionFilter;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historique des Équipements</h1>
            <p className="text-gray-600">Suivi complet des interventions et maintenances</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Effacer
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher équipement, technicien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
                <SelectItem value="failed">Échec</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maintenance préventive">Maintenance préventive</SelectItem>
                <SelectItem value="Réparation">Réparation</SelectItem>
                <SelectItem value="Installation">Installation</SelectItem>
                <SelectItem value="Diagnostic">Diagnostic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Historique des Interventions</span>
            <Badge variant="secondary">
              {filteredHistory.length} résultat{filteredHistory.length > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredHistory.map((entry, index) => (
                <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status)}
                        <Wrench className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {entry.equipmentName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {entry.equipmentId}
                          </Badge>
                          {getStatusBadge(entry.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div><strong>Action:</strong> {entry.action}</div>
                          <div><strong>Technicien:</strong> {entry.technician}</div>
                          <div><strong>Date:</strong> {new Date(entry.date).toLocaleDateString('fr-FR')}</div>
                          <div><strong>Durée:</strong> {entry.duration}</div>
                          <div><strong>Lieu:</strong> {entry.location}</div>
                          <div><strong>Coût:</strong> <span className="font-medium text-blue-600">{entry.cost}</span></div>
                        </div>
                        
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                          {entry.details}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {index < filteredHistory.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
