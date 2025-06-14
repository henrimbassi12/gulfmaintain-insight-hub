
import React from 'react';
import { Clock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const PendingApproval = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-100 p-4 rounded-full">
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Gulf Maintain
          </h1>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Compte en attente d'approbation
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Votre inscription a été reçue avec succès ! 
            <br /><br />
            Votre compte est actuellement en cours de validation par notre équipe d'administration. 
            Vous recevrez une notification par email dès que votre accès sera approuvé.
            <br /><br />
            Merci de votre patience.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Temps de traitement habituel :</strong> 24-48 heures
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={signOut}
            className="w-full"
          >
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
