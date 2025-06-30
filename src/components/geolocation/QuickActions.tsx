
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Share2, 
  Navigation, 
  AlertTriangle, 
  Route,
  MapPin,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface QuickActionsProps {
  userLocation: {lat: number, lng: number} | null;
}

export function QuickActions({ userLocation }: QuickActionsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  const shareLocation = async () => {
    if (!userLocation) {
      toast({
        title: "❌ Position requise",
        description: "Veuillez d'abord obtenir votre position",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    
    // Simulation du partage de position
    setTimeout(() => {
      setIsSharing(false);
      toast({
        title: "📍 Position partagée",
        description: "Votre position a été partagée avec l'équipe",
      });
    }, 1500);
  };

  const navigateToNext = () => {
    if (!userLocation) {
      toast({
        title: "❌ Position requise",
        description: "Veuillez d'abord obtenir votre position",
        variant: "destructive"
      });
      return;
    }

    // Simulation de la navigation vers la prochaine intervention
    const nextIntervention = "Agence BONABERI Port";
    const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/4.0383,9.7792`;
    
    window.open(googleMapsUrl, '_blank');
    
    toast({
      title: "🧭 Navigation démarrée",
      description: `Direction: ${nextIntervention}`,
    });
  };

  const reportIssue = () => {
    toast({
      title: "🆘 Problème signalé",
      description: "Votre signalement a été envoyé à l'équipe de supervision",
    });
  };

  const emergencyCall = () => {
    toast({
      title: "📞 Appel d'urgence",
      description: "Connexion avec le centre de supervision...",
    });
  };

  // Afficher seulement pour les techniciens
  if (userProfile?.role !== 'technician') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={shareLocation}
        disabled={isSharing}
        className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700"
      >
        <Share2 className={`w-4 h-4 ${isSharing ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline">
          {isSharing ? 'Partage...' : 'Partager'}
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={navigateToNext}
        className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700"
      >
        <Navigation className="w-4 h-4" />
        <span className="hidden sm:inline">Navigation</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={reportIssue}
        className="flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-700"
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="hidden sm:inline">Problème</span>
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={emergencyCall}
        className="flex items-center gap-2"
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Urgence</span>
      </Button>
    </div>
  );
}
