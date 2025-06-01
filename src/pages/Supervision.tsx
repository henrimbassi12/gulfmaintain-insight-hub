
import React, { useState } from 'react';
import { Brain } from "lucide-react";
import PredictionsList from "@/components/supervision/PredictionsList";
import TechnicianRecommendations from "@/components/supervision/TechnicianRecommendations";
import RecurrenceAnalysis from "@/components/supervision/RecurrenceAnalysis";
import AIReliabilityScore from "@/components/supervision/AIReliabilityScore";
import SupervisionFilters from "@/components/supervision/SupervisionFilters";

const Supervision = () => {
  const [sortBy, setSortBy] = useState<string>("risk");
  const [filters, setFilters] = useState({
    dateRange: "all",
    technician: "all",
    region: "all",
    riskLevel: "all"
  });

  // Mock data for AI predictions
  const failurePredictions = [
    {
      id: "EQ-001",
      name: "Climatiseur Bureau A1",
      failureRisk: 85,
      predictedDate: "2024-01-15",
      type: "AF",
      location: "Bâtiment A - Étage 1",
      recommendedAction: "Maintenance préventive urgente"
    },
    {
      id: "EQ-045",
      name: "Groupe électrogène Principal",
      failureRisk: 72,
      predictedDate: "2024-01-22",
      type: "NF",
      location: "Sous-sol technique",
      recommendedAction: "Inspection des filtres"
    },
    {
      id: "EQ-023",
      name: "Ascenseur Tour B",
      failureRisk: 68,
      predictedDate: "2024-01-28",
      type: "AF",
      location: "Tour B - Tous étages",
      recommendedAction: "Vérification câblage"
    }
  ];

  const technicianRecommendations = [
    {
      equipmentId: "EQ-001",
      equipmentName: "Climatiseur Bureau A1",
      technician: "Ahmed Ben Ali",
      matchScore: 94,
      expertise: ["Climatisation", "Réfrigération"],
      availability: "Disponible",
      location: "Tunis Centre",
      experience: "8 ans",
      successRate: 92
    },
    {
      equipmentId: "EQ-045",
      equipmentName: "Groupe électrogène Principal",
      technician: "Fatma Trabelsi",
      matchScore: 89,
      expertise: ["Électricité", "Groupes électrogènes"],
      availability: "Disponible demain",
      location: "Tunis Nord",
      experience: "12 ans",
      successRate: 87
    },
    {
      equipmentId: "EQ-023",
      equipmentName: "Ascenseur Tour B",
      technician: "Mohamed Khelifi",
      matchScore: 91,
      expertise: ["Ascenseurs", "Mécanique"],
      availability: "Disponible",
      location: "Tunis Centre",
      experience: "15 ans",
      successRate: 95
    }
  ];

  const recurrenceData = [
    { 
      equipment: "Climatiseur Bureau A1", 
      recurrenceRate: 23, 
      category: "Élevée",
      totalFailures: 8,
      avgTimeBetweenFailures: 45
    },
    { 
      equipment: "Imprimante Laser HP", 
      recurrenceRate: 8, 
      category: "Faible",
      totalFailures: 3,
      avgTimeBetweenFailures: 120
    },
    { 
      equipment: "Projecteur Salle 201", 
      recurrenceRate: 45, 
      category: "Très élevée",
      totalFailures: 12,
      avgTimeBetweenFailures: 30
    },
    { 
      equipment: "Photocopieur Canon", 
      recurrenceRate: 15, 
      category: "Modérée",
      totalFailures: 5,
      avgTimeBetweenFailures: 75
    }
  ];

  const aiMetrics = {
    predictionAccuracy: 89,
    confidenceScore: 92,
    totalPredictions: 1247,
    correctPredictions: 1110,
    modelVersion: "v2.1.3",
    lastUpdated: "2024-01-10 14:30"
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: "all",
      technician: "all",
      region: "all",
      riskLevel: "all"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supervision IA</h1>
          <p className="text-gray-600">Décisions assistées par intelligence artificielle</p>
        </div>
      </div>

      {/* Section d'aide à l'interprétation */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Guide d'interprétation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p><strong>🔴 Équipements critiques:</strong> Nécessitent une attention immédiate</p>
            <p><strong>🔶 Équipements à surveiller:</strong> Planifier maintenance préventive</p>
          </div>
          <div>
            <p><strong>🟢 Équipements stables:</strong> Surveillance continue</p>
            <p><strong>♻️ Récurrence élevée:</strong> Évaluer remplacement équipement</p>
          </div>
        </div>
      </div>

      {/* Filtres globaux */}
      <SupervisionFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Disposition responsive 3 colonnes / 2 blocs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche */}
        <div className="space-y-6">
          <PredictionsList 
            predictions={failurePredictions}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          
          <RecurrenceAnalysis data={recurrenceData} />
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          <TechnicianRecommendations recommendations={technicianRecommendations} />
          
          <AIReliabilityScore metrics={aiMetrics} />
        </div>
      </div>
    </div>
  );
};

export default Supervision;
