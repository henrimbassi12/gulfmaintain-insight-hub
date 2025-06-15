
import React from 'react';
import { MessageCircle } from 'lucide-react';

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <MessageCircle className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-gray-700">Messagerie</h3>
      <p className="text-center max-w-md mb-4">
        Sélectionnez une conversation pour commencer à discuter avec votre équipe.
      </p>
      <p className="text-sm text-center">
        Vous pouvez créer une nouvelle conversation en cliquant sur le bouton "Nouvelle conversation".
      </p>
    </div>
  );
}
