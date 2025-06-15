import React, { useState } from 'react';
import { Clock, Wrench, User, FileText, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HistoryEvent {
  id: string;
  date: Date;
  type: 'maintenance' | 'repair' | 'inspection' | 'installation' | 'replacement';
  title: string;
  description: string;
  technician: string;
  duration: string;
  cost?: number;
  parts?: string[];
  status: 'completed' | 'in-progress' | 'cancelled';
  photos?: string[];
  documents?: string[];
}

interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  installationDate: Date;
}

export function EquipmentHistory() {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('FR-2024-089');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const equipment: Equipment = {
    id: 'FR-2024-089',
    name: 'Réfrigérateur professionnel',
    model: 'Bosch KGN86AI30',
    serialNumber: 'BSH2024089456',
    installationDate: new Date('2024-01-15')
  };

  const history: HistoryEvent[] = [
    {
      id: '1',
      date: new Date('2024-01-28'),
      type: 'maintenance',
      title: 'Maintenance préventive trimestrielle',
      description: 'Nettoyage complet, vérification des joints, contrôle de température, remplacement des filtres',
      technician: 'CÉDRIC MBARGA',
      duration: '2h 30min',
      cost: 350,
      parts: ['Filtre air', 'Joint étanchéité'],
      status: 'completed',
      photos: ['maintenance1.jpg', 'maintenance2.jpg']
    },
    {
      id: '2',
      date: new Date('2024-01-20'),
      type: 'repair',
      title: 'Réparation thermostat défaillant',
      description: 'Remplacement du thermostat principal suite à dysfonctionnement détecté lors de la surveillance',
      technician: 'MBAPBOU GRÉGOIRE',
      duration: '1h 45min',
      cost: 125,
      parts: ['Thermostat digital'],
      status: 'completed'
    },
    {
      id: '3',
      date: new Date('2024-01-15'),
      type: 'installation',
      title: 'Installation initiale',
      description: 'Installation et mise en service du réfrigérateur professionnel',
      technician: 'VOUKENG JULES',
      duration: '3h 00min',
      cost: 200,
      status: 'completed',
      documents: ['garantie.pdf', 'manuel_utilisation.pdf']
    },
    {
      id: '4',
      date: new Date('2024-01-10'),
      type: 'inspection',
      title: 'Inspection de réception',
      description: 'Contrôle qualité et vérification de conformité avant installation',
      technician: 'TCHINDA CONSTANT',
      duration: '45min',
      status: 'completed'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'repair': return <Wrench className="w-4 h-4 text-red-500" />;
      case 'inspection': return <Search className="w-4 h-4 text-green-500" />;
      case 'installation': return <Clock className="w-4 h-4 text-purple-500" />;
      case 'replacement': return <Wrench className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'installation': return 'bg-purple-100 text-purple-800';
      case 'replacement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'maintenance': return 'Maintenance';
      case 'repair': return 'Réparation';
      case 'inspection': return 'Inspection';
      case 'installation': return 'Installation';
      case 'replacement': return 'Remplacement';
      default: return type;
    }
  };

  const filteredHistory = history.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCost = history.reduce((sum, event) => sum + (event.cost || 0), 0);
  const totalInterventions = history.length;
  const lastMaintenance = history
    .filter(h => h.type === 'maintenance')
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Historique des équipements
          </h2>
          <p className="text-gray-600 mt-1">Timeline complète des interventions</p>
        </div>
      </div>

      {/* Equipment Info & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalInterventions}</div>
            <div className="text-sm text-gray-600">Interventions totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{totalCost}€</div>
            <div className="text-sm text-gray-600">Coût total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {lastMaintenance ? Math.floor((Date.now() - lastMaintenance.date.getTime()) / (1000 * 60 * 60 * 24)) : '-'}
            </div>
            <div className="text-sm text-gray-600">Jours depuis dernière maintenance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor((Date.now() - equipment.installationDate.getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-600">Jours en service</div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informations de l'équipement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">ID Équipement:</span>
              <div className="font-mono text-sm text-blue-600">{equipment.id}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Modèle:</span>
              <div className="font-medium">{equipment.model}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Numéro de série:</span>
              <div className="font-mono text-sm">{equipment.serialNumber}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Date d'installation:</span>
              <div className="font-medium">{equipment.installationDate.toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'intervention" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Réparation</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="installation">Installation</SelectItem>
                <SelectItem value="replacement">Remplacement</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline des interventions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {filteredHistory.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-16 flex justify-center">
                    <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full z-10"></div>
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(event.type)}
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge className={getTypeColor(event.type)}>
                          {getTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {event.date.toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.date.toLocaleTimeString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Technicien:</span>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{event.technician}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Durée:</span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{event.duration}</span>
                        </div>
                      </div>
                      {event.cost && (
                        <div>
                          <span className="text-sm text-gray-500">Coût:</span>
                          <div className="font-semibold text-green-600">{event.cost}€</div>
                        </div>
                      )}
                    </div>
                    
                    {event.parts && event.parts.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 block mb-2">Pièces utilisées:</span>
                        <div className="flex flex-wrap gap-2">
                          {event.parts.map((part, idx) => (
                            <Badge key={idx} variant="outline">{part}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(event.photos || event.documents) && (
                      <div className="flex gap-4">
                        {event.photos && (
                          <div>
                            <span className="text-sm text-gray-500">Photos: </span>
                            <span className="text-sm text-blue-600">{event.photos.length} fichier(s)</span>
                          </div>
                        )}
                        {event.documents && (
                          <div>
                            <span className="text-sm text-gray-500">Documents: </span>
                            <span className="text-sm text-blue-600">{event.documents.length} fichier(s)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun événement trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
