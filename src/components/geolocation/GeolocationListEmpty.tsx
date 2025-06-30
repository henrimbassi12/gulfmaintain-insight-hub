
import React from 'react';
import { MapPin } from 'lucide-react';

export function GeolocationListEmpty() {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>Aucun élément trouvé</p>
      <p className="text-sm">Ajustez vos filtres ou votre recherche</p>
    </div>
  );
}
