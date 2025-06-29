
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, AlertTriangle, Clock, User, Award, BarChart3, FileText } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { MobileHeader } from '@/components/MobileHeader';
import { PredictionForm } from '@/components/supervision/PredictionForm';
import { useNavigate } from 'react-router-dom';

export default function Supervision() {
  const navigate = useNavigate();

  // Widget Taux de réussite
  const successRate = 92;

  // Urgences en cours
  const urgentMaintenances = [
    {
      id: 'URG-001',
      location: 'Douala Centre',
      type: 'Compresseur défaillant',
      status: 'En cours',
      technician: 'VOUKENG',
      equipment: 'TAG145 - INNOVA 1000',
      priority: 'Critique'
    },
    {
      id: 'URG-002',
      location: 'Yaoundé Melen',
      type: 'Panne électrique',
      status: 'Prévu',
      technician: 'MBAPBOU Grégoire',
      equipment: 'TAG211 - SANDEN 500',
      priority: 'Haute'
    }
  ];

  // Top techniciens
  const topTechnicians = [
    {
      name: 'VOUKENG',
      successRate: 96,
      averageTime: '38 min',
      completedJobs: 24,
      rank: 1
    },
    {
      name: 'TCHINDA Constant',
      successRate: 94,
      averageTime: '42 min',
      completedJobs: 22,
      rank: 2
    },
    {
      name: 'MBAPBOU Grégoire',
      successRate: 91,
      averageTime: '45 min',
      completedJobs: 20,
      rank: 3
    },
    {
      name: 'Cédric',
      successRate: 89,
      averageTime: '48 min',
      completedJobs: 18,
      rank: 4
    }
  ];

  // Durées moyennes d'intervention
  const interventionTimes = {
    preventive: 42,
    corrective: 67
  };

  const handleDetailsComplets = () => {
    navigate('/reports');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <MobileHeader />
      
      {/* Header desktop */}
      <div className="hidden md:block">
        <AirbnbHeader
          title="Supervision & IA"
          subtitle="Pilotage analytique et prédictions en temps réel"
          icon={Bot}
        />
      </div>

      <div className="px-4 py-4 md:px-6 md:py-8 space-y-6">
        {/* Header mobile */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supervision & IA</h1>
              <p className="text-sm text-gray-500">Pilotage analytique et prédictions</p>
            </div>
          </div>
        </div>

        {/* Widgets de performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Widget Taux de réussite */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Taux de réussite</p>
                  <p className="text-3xl font-bold text-green-800">{successRate}%</p>
                  <p className="text-xs text-green-600">Ce mois</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgences en cours */}
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Urgences en cours</p>
                  <p className="text-3xl font-bold text-red-800">{urgentMaintenances.length}</p>
                  <p className="text-xs text-red-600">Intervention immédiate</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Durée moyenne préventif */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Préventif moyen</p>
                  <p className="text-3xl font-bold text-blue-800">{interventionTimes.preventive} min</p>
                  <p className="text-xs text-blue-600">Temps d'intervention</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Durée moyenne correctif */}
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Correctif moyen</p>
                  <p className="text-3xl font-bold text-orange-800">{interventionTimes.corrective} min</p>
                  <p className="text-xs text-orange-600">Temps d'intervention</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgences en cours - Détail */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              Urgences en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {urgentMaintenances.map((urgent) => (
                <div key={urgent.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-600 text-white">{urgent.priority}</Badge>
                        <span className="font-mono text-sm text-red-700">{urgent.id}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{urgent.equipment}</h4>
                      <p className="text-sm text-gray-600 mb-2">{urgent.type}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {urgent.technician}
                        </span>
                        <span>{urgent.location}</span>
                      </div>
                    </div>
                    <Badge className={urgent.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                      {urgent.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prédiction IA - Nouveau formulaire */}
        <PredictionForm />

        {/* Top techniciens */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              Top Techniciens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topTechnicians.map((tech) => (
                <div key={tech.name} className={`p-4 rounded-lg border ${
                  tech.rank === 1 ? 'bg-yellow-50 border-yellow-200' :
                  tech.rank === 2 ? 'bg-gray-50 border-gray-200' :
                  tech.rank === 3 ? 'bg-orange-50 border-orange-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={
                      tech.rank === 1 ? 'bg-yellow-500 text-white' :
                      tech.rank === 2 ? 'bg-gray-500 text-white' :
                      tech.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }>
                      #{tech.rank}
                    </Badge>
                    <span className={`text-2xl font-bold ${
                      tech.rank === 1 ? 'text-yellow-600' :
                      tech.rank === 2 ? 'text-gray-600' :
                      tech.rank === 3 ? 'text-orange-600' :
                      'text-blue-600'
                    }`}>
                      {tech.successRate}%
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{tech.name}</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Temps moyen:</span>
                      <span className="font-medium">{tech.averageTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interventions:</span>
                      <span className="font-medium">{tech.completedJobs}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparaison préventif vs correctif */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Comparaison des Durées d'Intervention
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Maintenance Préventive</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Durée moyenne</span>
                  <span className="text-2xl font-bold text-blue-800">{interventionTimes.preventive} min</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(interventionTimes.preventive / 100) * 100}%` }}></div>
                </div>
                <p className="text-xs text-blue-600 mt-2">Interventions planifiées et optimisées</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-3">Maintenance Corrective</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-orange-700">Durée moyenne</span>
                  <span className="text-2xl font-bold text-orange-800">{interventionTimes.corrective} min</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(interventionTimes.corrective / 100) * 100}%` }}></div>
                </div>
                <p className="text-xs text-orange-600 mt-2">Interventions d'urgence et réparations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton détails complets */}
        <div className="flex justify-center pt-4">
          <Button onClick={handleDetailsComplets} size="lg" className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Détails complets
          </Button>
        </div>
      </div>
    </div>
  );
}
