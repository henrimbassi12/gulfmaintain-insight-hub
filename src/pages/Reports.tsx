
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, RefreshCw, Activity, Download, BarChart3 } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { toast } from 'sonner';

export default function Reports() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des rapports...',
        success: 'Rapports actualisés avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleGenerateReport = () => {
    toast.success("Génération du rapport démarrée...");
  };

  const reports = [
    {
      id: 1,
      title: 'Rapport mensuel - Janvier 2024',
      type: 'Maintenance',
      date: '31/01/2024',
      status: 'Terminé',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Analyse des pannes - Q4 2023',
      type: 'Analyse',
      date: '15/01/2024',
      status: 'Terminé',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Performance techniciens - Décembre',
      type: 'RH',
      date: '05/01/2024',
      status: 'En cours',
      size: '-'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rapports</h1>
                  <p className="text-sm text-gray-500">Génération et consultation des rapports d'activité</p>
                </div>
                <ConnectionStatus />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none hover:bg-blue-50 border-gray-200"
              >
                <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Sync</span>
              </Button>
              
              <Button 
                onClick={handleGenerateReport}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Générer rapport</span>
                <span className="sm:hidden">Générer</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Statistiques des rapports */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Aperçu des rapports
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
                {reports.length} rapports
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-blue-600 mb-1">18</p>
                <p className="text-sm text-gray-600">Rapports ce mois</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-green-600 mb-1">15</p>
                <p className="text-sm text-gray-600">Terminés</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-orange-600 mb-1">3</p>
                <p className="text-sm text-gray-600">En cours</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-purple-600 mb-1">156</p>
                <p className="text-sm text-gray-600">Téléchargements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types de rapports disponibles */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-lg">Types de rapports disponibles</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">Rapport de maintenance</h3>
                <p className="text-sm text-gray-600">Synthèse des activités de maintenance préventive et curative</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">Analyse des pannes</h3>
                <p className="text-sm text-gray-600">Statistiques détaillées sur les défaillances d'équipements</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">Performance techniciens</h3>
                <p className="text-sm text-gray-600">Évaluation des performances et KPIs des techniciens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rapports récents */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Rapports récents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="py-4 px-6 font-semibold">Titre</th>
                    <th className="py-4 px-6 font-semibold">Type</th>
                    <th className="py-4 px-6 font-semibold">Date</th>
                    <th className="py-4 px-6 font-semibold">Statut</th>
                    <th className="py-4 px-6 font-semibold">Taille</th>
                    <th className="py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{report.title}</span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{report.date}</td>
                      <td className="py-4 px-6">
                        <Badge className={`text-xs ${
                          report.status === 'Terminé' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{report.size}</td>
                      <td className="py-4 px-6">
                        {report.status === 'Terminé' && (
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
