
// Métriques de performance du modèle IA basées sur vos données
const MODEL_METRICS = {
  "Entretien_renforce": { precision: 1.0, recall: 1.0, f1: 1.0, support: 6 },
  "Investigation_defaillance": { precision: 1.0, recall: 0.67, f1: 0.80, support: 3 },
  "Maintenance_preventive": { precision: 0.97, recall: 0.97, f1: 0.97, support: 30 },
  "Surveillance_renforcee": { precision: 0.92, recall: 0.96, f1: 0.94, support: 25 },
};

const GLOBAL_ACCURACY = 0.9531; // 95.31%

export interface EnrichedPredictionMessage {
  title: string;
  description: string;
  confidence: string;
  interpretation: string;
  recommendation?: string;
}

export function formatPredictionMessage(
  predictedClass: string, 
  confidenceScore?: number
): EnrichedPredictionMessage {
  console.log('🔍 SERVICE formatPredictionMessage - Début du traitement:', { predictedClass, confidenceScore });
  
  const metrics = MODEL_METRICS[predictedClass as keyof typeof MODEL_METRICS];
  const displayName = predictedClass.replace(/_/g, ' ');
  
  console.log('📊 SERVICE - Métriques trouvées:', metrics);
  console.log('🏷️ SERVICE - Nom d\'affichage:', displayName);
  
  if (!metrics) {
    console.log('⚠️ SERVICE - Aucune métrique trouvée, utilisation du message par défaut');
    const defaultMessage = {
      title: `Prédiction IA : ${displayName}`,
      description: `Basée sur un modèle d'intelligence artificielle avec une précision globale de ${Math.round(GLOBAL_ACCURACY * 100)}%.`,
      confidence: `Confiance : ${confidenceScore || 85}%`,
      interpretation: `Il est probable que le statut post-entretien soit : **${displayName}**.`
    };
    console.log('📤 SERVICE - Message par défaut créé:', defaultMessage);
    return defaultMessage;
  }

  const precision = Math.round(metrics.precision * 100);
  const recall = Math.round(metrics.recall * 100);
  const f1Score = Math.round(metrics.f1 * 100);

  let recommendation = '';
  switch (predictedClass) {
    case 'Entretien_renforce':
      recommendation = '🔧 Action requise : Planifier un entretien renforcé pour optimiser les performances de l\'équipement.';
      break;
    case 'Investigation_defaillance':
      recommendation = '🔍 Investigation nécessaire : Effectuer un diagnostic approfondi pour identifier les causes de défaillance.';
      break;
    case 'Maintenance_preventive':
      recommendation = '✅ Maintenance préventive recommandée : Suivre le programme de maintenance standard.';
      break;
    case 'Surveillance_renforcee':
      recommendation = '👁️ Surveillance renforcée : Augmenter la fréquence de contrôle pour anticiper tout défaut critique.';
      break;
  }

  const enrichedMessage = {
    title: `Prédiction IA : ${displayName}`,
    description: `Basée sur un modèle d'intelligence artificielle affichant une précision globale de ${Math.round(GLOBAL_ACCURACY * 100)}%, cette prédiction repose sur l'analyse de plusieurs critères critiques observés lors des maintenances précédentes.`,
    confidence: `Confiance élevée : le modèle affiche une précision de ${precision}% pour cette catégorie spécifique, avec un rappel de ${recall}% et un score F1 de ${f1Score}%.`,
    interpretation: `Interprétation : Il est fortement probable que le statut post-entretien soit : **${displayName}**.`,
    recommendation
  };
  
  console.log('✅ SERVICE - Message enrichi créé avec succès:', enrichedMessage);
  return enrichedMessage;
}

export function getModelPerformanceDetails(predictedClass: string): string {
  console.log('🔍 SERVICE getModelPerformanceDetails - Traitement pour:', predictedClass);
  
  const metrics = MODEL_METRICS[predictedClass as keyof typeof MODEL_METRICS];
  
  if (!metrics) {
    const defaultDetails = `Performances du modèle : Précision globale de ${Math.round(GLOBAL_ACCURACY * 100)}%`;
    console.log('📤 SERVICE - Détails par défaut des performances:', defaultDetails);
    return defaultDetails;
  }

  const performanceDetails = `➡️ Pour la classe « ${predictedClass.replace(/_/g, ' ')} », les performances du modèle sont :
- Précision : ${Math.round(metrics.precision * 100)}%
- Rappel : ${Math.round(metrics.recall * 100)}%
- F1-Score : ${Math.round(metrics.f1 * 100)}%
- Échantillons d'entraînement : ${metrics.support}`;

  console.log('📤 SERVICE - Détails des performances créés:', performanceDetails);
  return performanceDetails;
}
