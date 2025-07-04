
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
  formattedResult: string;
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
      title: `🧠 Résultat IA : ${displayName}`,
      description: `Ce statut est prédit selon notre modèle affichant une performance générale de ${Math.round(GLOBAL_ACCURACY * 100)} %.`,
      confidence: `Confiance : ${confidenceScore || 85}%`,
      interpretation: `Il est probable que le statut post-entretien soit : **${displayName}**.`,
      formattedResult: `🧠 Résultat IA : ${displayName}\n\nCe statut est prédit selon notre modèle affichant une performance générale de ${Math.round(GLOBAL_ACCURACY * 100)} %.\n\n✅ Statut prédit : ${displayName}.`
    };
    console.log('📤 SERVICE - Message par défaut créé:', defaultMessage);
    return defaultMessage;
  }

  const precision = Math.round(metrics.precision * 100);
  const recall = Math.round(metrics.recall * 100);
  const f1Score = (metrics.f1 * 100).toFixed(0);

  let recommendation = '';
  let emoji = '🧠';
  let statusTitle = '';
  
  switch (predictedClass) {
    case 'Entretien_renforce':
      statusTitle = 'Entretien renforcé';
      recommendation = '🔧 Il est recommandé de planifier un entretien renforcé pour optimiser les performances de cet équipement.';
      emoji = '🔧';
      break;
    case 'Investigation_defaillance':
      statusTitle = 'Investigation défaillance';
      recommendation = '🔍 Il est recommandé d\'effectuer une investigation approfondie pour identifier les causes de défaillance.';
      emoji = '🔍';
      break;
    case 'Maintenance_preventive':
      statusTitle = 'Maintenance préventive';
      recommendation = '✅ Il est recommandé de suivre le programme de maintenance préventive standard.';
      emoji = '✅';
      break;
    case 'Surveillance_renforcee':
      statusTitle = 'Surveillance renforcée';
      recommendation = '👁️ Il est recommandé de renforcer la surveillance de cet équipement pour anticiper tout défaut critique.';
      emoji = '👁️';
      break;
  }

  // Nouveau format selon vos spécifications
  const formattedResult = `${emoji} Résultat IA : ${statusTitle}

Ce statut est prédit avec une précision de ${precision} %, un rappel de ${recall} % et un F1-score de ${f1Score} %, selon notre modèle affichant une performance générale de ${Math.round(GLOBAL_ACCURACY * 100)} %.

👉 ${recommendation.replace(/^[🔧🔍✅👁️]\s/, '')}`;

  const enrichedMessage = {
    title: `${emoji} Résultat IA : ${statusTitle}`,
    description: `Ce statut est prédit avec une précision de ${precision} %, un rappel de ${recall} % et un F1-score de ${f1Score} %, selon notre modèle affichant une performance générale de ${Math.round(GLOBAL_ACCURACY * 100)} %.`,
    confidence: `Confiance élevée : précision ${precision}%, rappel ${recall}%, F1-score ${f1Score}%`,
    interpretation: `Il est fortement probable que le statut post-entretien soit : **${statusTitle}**.`,
    recommendation,
    formattedResult
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
