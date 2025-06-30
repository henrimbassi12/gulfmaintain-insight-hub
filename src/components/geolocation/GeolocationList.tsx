
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';
import { GeolocationListProps } from '@/types/geolocation-list';
import { GeolocationListItemComponent } from './GeolocationListItem';
import { GeolocationListEmpty } from './GeolocationListEmpty';

export function GeolocationList({ items, onCenterOnMap, selectedItem }: GeolocationListProps) {
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
              <GeolocationListEmpty />
            ) : (
              items.map((item) => (
                <GeolocationListItemComponent
                  key={item.id}
                  item={item}
                  isSelected={selectedItem === item.id}
                  onCenterOnMap={onCenterOnMap}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
