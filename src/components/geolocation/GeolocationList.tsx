
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, User, Wrench, Calendar, Phone, Target } from 'lucide-react';

interface GeolocationListProps {
  items: any[];
  onCenterOnMap: (lat: number, lng: number, itemId: string) => void;
  selectedItem: string | null;
}

export function GeolocationList({ items, onCenterOnMap, selectedItem }: GeolocationListProps) {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'technician': return User;
      case 'equipment': return Wrench;
      case 'intervention': return Calendar;
      default: return MapPin;
    }
  };

  const getStatusColor = (item: any) => {
    if (item.type === 'technician') {
      switch (item.status) {
        case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'busy': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
        case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    } else if (item.type === 'equipment') {
      switch (item.status) {
        case 'operational': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
        case 'down': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    } else if (item.type === 'intervention') {
      switch (item.priority) {
        case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
        case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getStatusText = (item: any) => {
    if (item.type === 'technician') {
      switch (item.status) {
        case 'available': return '✅ Disponible';
        case 'busy': return '🔄 Occupé';
        case 'offline': return '❌ Hors ligne';
        default: return item.status;
      }
    } else if (item.type === 'equipment') {
      switch (item.status) {
        case 'operational': return '✅ Opérationnel';
        case 'maintenance': return '🔧 Maintenance';
        case 'down': return '❌ En panne';
        default: return item.status;
      }
    } else if (item.type === 'intervention') {
      switch (item.priority) {
        case 'high': return '🔴 Critique';
        case 'medium': return '🟡 Normale';
        case 'low': return '🟢 Faible';
        default: return item.priority;
      }
    }
    return '';
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          📋 Éléments sur la carte
          <Badge variant="secondary" className="ml-auto">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-3 p-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun élément trouvé</p>
                <p className="text-sm">Ajustez vos filtres ou votre recherche</p>
              </div>
            ) : (
              items.map((item) => {
                const IconComponent = getItemIcon(item.type);
                const isSelected = selectedItem === item.id;
                
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-full ${
                          item.type === 'technician' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          item.type === 'equipment' ? 'bg-green-100 dark:bg-green-900/30' :
                          'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            item.type === 'technician' ? 'text-blue-600 dark:text-blue-400' :
                            item.type === 'equipment' ? 'text-green-600 dark:text-green-400' :
                            'text-purple-600 dark:text-purple-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {item.name || item.equipment}
                          </h4>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            📍 {item.address || item.sectors}
                          </p>
                          
                          {item.type === 'technician' && item.distance && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              📏 {item.distance} de vous
                            </p>
                          )}
                          
                          {item.type === 'equipment' && item.lastMaintenance && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              🔧 Dernière maintenance: {item.lastMaintenance}
                            </p>
                          )}
                          
                          {item.type === 'intervention' && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                📅 {item.scheduledDate}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ⏱️ Durée estimée: {item.estimatedDuration}
                              </p>
                              {item.assignedTechnician && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  👤 {item.assignedTechnician}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(item)}>
                              {getStatusText(item)}
                            </Badge>
                            
                            {item.currentTask && (
                              <Badge variant="outline" className="text-xs">
                                {item.currentTask}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCenterOnMap(item.lat, item.lng, item.id)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Target className="w-3 h-3" />
                        Centrer
                      </Button>
                      
                      {item.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          Appel
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-blue-600 dark:text-blue-400"
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
