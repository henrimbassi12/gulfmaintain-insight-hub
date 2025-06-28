
export interface PredictionData {
  taux_remplissage_pct: number;
  temperature_c: number;
  lineaire_val: number;
  tension_v: number;
  intensite_avant_entretien_a: number;
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
  purge_circuit_eaux: string;
  soufflage_parties_actives: string;
  date: string;
}

export interface PredictionResult {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
}
