export interface PredictionData {
  taux_remplissage_pct: string;
  temperature_c: string;
  lineaire_val: string;
  tension_v: string;
  intensite_avant_entretien_a: string;
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
  interventionDate: string;
  seasonality: string;
  equipmentType: string;
  equipmentAge: string;
  lastMaintenanceDate: string;
  usageIntensity: string;
  latitude: string;
  longitude: string;
  availableTechnicians: string;
  technicianExperience: string;
  workload: string;
  responseTime: string;
  temperature: string;
  humidity: string;
  vibration: string;
  operatingHours: string;
  failureHistory: string;
}

export interface PredictionResult {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
  probabilities?: {
    [key: string]: number;
  };
}
