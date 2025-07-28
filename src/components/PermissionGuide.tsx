import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, MapPin, Bell, Smartphone, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PermissionGuideProps {
  type: 'camera' | 'location' | 'notifications';
  onRetry?: () => void;
}

export function PermissionGuide({ type, onRetry }: PermissionGuideProps) {
  const getGuideContent = () => {
    switch (type) {
      case 'camera':
        return {
          icon: <Camera className="w-6 h-6 text-blue-600" />,
          title: 'Accès Caméra/Microphone',
          description: 'Pour utiliser les appels vidéo et audio',
          steps: [
            'Appuyez sur l\'icône de cadenas 🔒 dans la barre d\'adresse',
            'Activez "Caméra" et "Microphone"',
            'Actualisez la page ou réessayez l\'appel'
          ],
          mobileSteps: [
            'Sur Safari : Touchez le bouton "aA" puis "Paramètres du site web"',
            'Activez "Caméra" et "Microphone"',
            'Rechargez la page'
          ]
        };
      
      case 'location':
        return {
          icon: <MapPin className="w-6 h-6 text-green-600" />,
          title: 'Accès à la Position',
          description: 'Pour localiser les équipements et techniciens',
          steps: [
            'Cliquez sur l\'icône de localisation 📍 dans la barre d\'adresse',
            'Sélectionnez "Toujours autoriser" ou "Autoriser"',
            'Confirmez votre choix'
          ],
          mobileSteps: [
            'Sur Safari : Touchez "aA" → "Paramètres du site web"',
            'Activez "Localisation"',
            'Sur Chrome : Menu → Paramètres du site → Localisation'
          ]
        };
      
      case 'notifications':
        return {
          icon: <Bell className="w-6 h-6 text-purple-600" />,
          title: 'Notifications Push',
          description: 'Pour recevoir les alertes importantes',
          steps: [
            'Cliquez sur l\'icône de notification 🔔 dans la barre d\'adresse',
            'Sélectionnez "Autoriser"',
            'Confirmez dans la popup du navigateur'
          ],
          mobileSteps: [
            'Sur Safari : Réglages → Safari → Notifications de sites web',
            'Trouvez votre site et activez les notifications',
            'Sur Chrome : Paramètres du site → Notifications'
          ]
        };
    }
  };

  const content = getGuideContent();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {content.icon}
        </div>
        <CardTitle className="text-lg">{content.title}</CardTitle>
        <p className="text-sm text-gray-600">{content.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Permission requise pour accéder à cette fonctionnalité
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4" />
            <span className="font-medium text-sm">
              {isMobile ? 'Sur mobile' : 'Sur ordinateur'} :
            </span>
          </div>
          
          {(isMobile ? content.mobileSteps : content.steps).map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>

        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Une fois activé, vous pourrez utiliser toutes les fonctionnalités !
          </AlertDescription>
        </Alert>

        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            Réessayer
          </Button>
        )}

        <div className="text-center">
          <Button variant="link" size="sm" asChild>
            <a href="https://support.google.com/chrome/answer/2693767" target="_blank" rel="noopener noreferrer">
              <Info className="w-4 h-4 mr-1" />
              Guide détaillé
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}