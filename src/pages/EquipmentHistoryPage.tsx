
import React from 'react';
import { EquipmentHistory } from '@/components/EquipmentHistory';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header stylé comme le Dashboard */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 sticky top-0 z-40 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                  Historique des équipements
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
                  Timeline complète des interventions et maintenances
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="flex-1 sm:flex-none hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
              >
                <RefreshCw className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Sync</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <EquipmentHistory />
        </div>
      </div>
    </div>
  );
}
