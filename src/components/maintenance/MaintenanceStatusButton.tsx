
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Clock } from "lucide-react";

interface MaintenanceStatusButtonProps {
  status: string;
  onStart: () => void;
  onComplete: () => void;
  disabled?: boolean;
}

export function MaintenanceStatusButton({ 
  status, 
  onStart, 
  onComplete, 
  disabled = false 
}: MaintenanceStatusButtonProps) {
  if (status === 'planned' || status === 'prevu') {
    return (
      <Button 
        size="sm" 
        className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
        onClick={onStart}
        disabled={disabled}
      >
        <Play className="w-4 h-4 mr-1" />
        Démarrer
      </Button>
    );
  }

  if (status === 'in-progress') {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-sm text-orange-600 font-medium">En cours</span>
        </div>
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          onClick={onComplete}
          disabled={disabled}
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Terminer
        </Button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Terminé</span>
      </div>
    );
  }

  return null;
}
