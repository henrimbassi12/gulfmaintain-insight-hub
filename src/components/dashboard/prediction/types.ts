
export interface PredictionData {
  taux_remplissage: number;
  temperature: number;
  lineaire: string;
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
  puissance_electrique: number;
  debit_fluide: number;
  pression_condenseur: number;
  humidite: number;
  co2_niveau: number;
  vibrations: number;
  bruit: number;
  consommation: number;
  performance_globale: number;
  temperature_ambiante: number;
  poids_frigo: number;
}

export interface PredictionResult {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
}
