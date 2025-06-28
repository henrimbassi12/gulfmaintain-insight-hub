
export interface PredictionData {
  taux_remplissage: number;
  temperature: number;
  lineaire: number;
  tension: number;
  intensite_avant: number;
  technicien_gfi: string;
  division: string;
  secteur: string;
  partenaire: string;
  ville: string;
  quartier: string;
  type_frigo: string;
  af_nf: string;
  branding: string;
  securite: string;
  eclairage: string;
  purge_circuit: string;
  soufflage_parties: string;
  date: string;
}

export interface PredictionResult {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
}
