
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, RefreshCw, Activity, Send, Search } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

export default function Messages() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des messages...',
        success: 'Messages actualisés avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const messages = [
    {
      id: 1,
      sender: 'Ahmed Benali',
      subject: 'Maintenance FR-2024-089 terminée',
      preview: 'La maintenance préventive a été réalisée avec succès...',
      time: '14:30',
      unread: true
    },
    {
      id: 2,
      sender: 'Fatima Zahra',
      subject: 'Problème sur équipement FR-2024-012',
      preview: 'J\'ai détecté un problème sur le réfrigérateur...',
      time: '13:45',
      unread: true
    },
    {
      id: 3,
      sender: 'Mohamed Alami',
      subject: 'Rapport hebdomadaire',
      preview: 'Voici le rapport des interventions de la semaine...',
      time: '12:20',
      unread: false
    }
  ];

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Messages"
        subtitle="Communication et notifications de l'équipe"
        icon={MessageCircle}
      >
        <ModernButton 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          icon={RefreshCw}
          className={refreshing ? 'animate-spin' : ''}
        >
          Actualiser
        </ModernButton>
        
        <ModernButton 
          icon={Send}
        >
          Nouveau message
        </ModernButton>
      </AirbnbHeader>

      {/* Statistiques des messages */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Aperçu des messages
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              2 non lus
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-blue-600 mb-1">15</p>
              <p className="text-sm text-gray-600">Messages aujourd'hui</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-red-600 mb-1">2</p>
              <p className="text-sm text-gray-600">Non lus</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-green-600 mb-1">8</p>
              <p className="text-sm text-gray-600">Rapports reçus</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-purple-600 mb-1">5</p>
              <p className="text-sm text-gray-600">Alertes urgentes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barre de recherche */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans les messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des messages */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            Messages récents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  message.unread ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${message.unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {message.sender}
                      </h3>
                      {message.unread && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">Nouveau</Badge>
                      )}
                    </div>
                    <p className={`font-medium mb-1 ${message.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-500">{message.preview}</p>
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AirbnbContainer>
  );
}
