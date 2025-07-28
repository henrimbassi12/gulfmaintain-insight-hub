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
  const [isNavigating, setIsNavigating] = useState(false);
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
    
    try {
      // Simulation du partage de position avec animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler l'envoi des coordonnées à l'équipe
      if (process.env.NODE_ENV === 'development') {
        console.log('Position partagée');
      }
      
      toast({
        title: "📍 Position partagée",
        description: "Votre position a été partagée avec l'équipe de supervision",
      });
    } catch (error) {
      toast({
        title: "❌ Erreur de partage",
        description: "Impossible de partager votre position",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const navigateToNext = async () => {
    if (!userLocation) {
      toast({
        title: "❌ Position requise",
        description: "Veuillez d'abord obtenir votre position",
        variant: "destructive"
      });
      return;
    }

    setIsNavigating(true);
    
    try {
      // Prochaine intervention simulée
      const nextIntervention = {
        name: "Agence BONABERI Port",
        address: "Rue de la Liberté, Bonabéri, Douala",
        lat: 4.0383,
        lng: 9.7792,
        equipment: "FR-2024-012"
      };
      
      // Construire l'URL Google Maps avec navigation
      const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${nextIntervention.lat},${nextIntervention.lng}`;
      
      // Ouvrir dans un nouvel onglet
      window.open(googleMapsUrl, '_blank');
      
      toast({
        title: "🧭 Navigation démarrée",
        description: `Direction: ${nextIntervention.name}`,
      });
      
      console.log('Navigation vers:', nextIntervention);
    } catch (error) {
      toast({
        title: "❌ Erreur de navigation",
        description: "Impossible de démarrer la navigation",
        variant: "destructive"
      });
    } finally {
      setIsNavigating(false);
    }
  };

  const reportIssue = () => {
    const issueData = {
      timestamp: new Date().toISOString(),
      userLocation,
      userId: userProfile?.id,
      type: 'geolocation_issue'
    };
    
    console.log('Problème signalé:', issueData);
    
    toast({
      title: "🆘 Problème signalé",
      description: "Votre signalement a été envoyé à l'équipe de supervision",
    });
  };

  const emergencyCall = () => {
    const emergencyData = {
      timestamp: new Date().toISOString(),
      userLocation,
      userId: userProfile?.id,
      type: 'emergency_call'
    };
    
    console.log('Appel d\'urgence déclenché:', emergencyData);
    
    // Simuler l'ouverture de l'interface d'appel
    const phoneNumber = '+237650000000'; // Numéro de supervision
    
    if (navigator.userAgent.includes('Mobile')) {
      // Sur mobile, essayer d'ouvrir l'application téléphone
      window.location.href = `tel:${phoneNumber}`;
    }
    
    toast({
      title: "📞 Appel d'urgence",
      description: "Connexion avec le centre de supervision en cours...",
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
        disabled={isNavigating}
        className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700"
      >
        <Navigation className={`w-4 h-4 ${isNavigating ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline">
          {isNavigating ? 'Navigation...' : 'Navigation'}
        </span>
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