
import React, { useState } from 'react';
import { EquipmentHistory } from '@/components/EquipmentHistory';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileHeader } from '@/components/MobileHeader';
import { RealtimeNotificationCenter } from '@/components/history/RealtimeNotificationCenter';
import { toast } from 'sonner';

export default function EquipmentHistoryPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Forcer le rechargement des données en actualisant le cache
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <MobileHeader />
      
      {/* Header desktop uniquement - style amélioré */}
      <div className="hidden md:block">
        <div className="glass-effect shadow-lg border-b border-purple-100 dark:border-purple-800/30 sticky top-0 z-40 w-full">
          <div className="w-full px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 animate-pulse-glow">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1 leading-tight animate-fade-in-up">
                    Historique des équipements
                  </h1>
                  <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
                    Timeline complète des interventions et prédictions IA en temps réel
                  </p>
                </div>
              </div>
              
               <div className="flex items-center gap-3">
                <RealtimeNotificationCenter />
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="hover-lift glass-effect border-purple-200 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-800/50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
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
            <RealtimeNotificationCenter />
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="glass-effect rounded-2xl floating-shadow border border-purple-100/50 dark:border-purple-700/30 w-full overflow-hidden animate-scale-in">
          <EquipmentHistory />
        </div>
      </div>
    </div>
  );
}
