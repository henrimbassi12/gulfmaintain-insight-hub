
import React from 'react';
import { EquipmentHistory } from '@/components/EquipmentHistory';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileHeader } from '@/components/MobileHeader';
import { toast } from 'sonner';

export default function EquipmentHistoryPage() {
  const handleRefresh = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Actualisation de l\'historique...',
        success: 'Historique actualisé avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileHeader />
      
      {/* Header desktop uniquement - style référence Messages */}
      <div className="hidden md:block">
        <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 sticky top-0 z-40 w-full">
          <div className="w-full px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                    Historique des équipements
                  </h1>
                  <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
                    Timeline complète des interventions et maintenances
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="hover:bg-orange-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal - section empilée verticalement */}
      <div className="px-4 py-4 space-y-4">
        {/* Header mobile avec boutons d'action */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Historique</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Timeline des interventions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full">
          <EquipmentHistory />
        </div>
      </div>
    </div>
  );
}
